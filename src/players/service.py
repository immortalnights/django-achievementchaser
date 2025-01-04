import typing
from datetime import datetime, date, timedelta
from loguru import logger
from django.db import models
from django.utils import timezone
from games.models import Game
from games.service import resynchronize_game
from .models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement
from .steam import resolve_vanity_url, load_player_summary, get_owned_games, get_player_achievements_for_game


def resolve_identity(identity: typing.Union[str, int]) -> typing.Optional[int]:
    """Resolve a player id, url or friendly name to a Steam ID integer"""
    player_id = None
    resolved_identity: typing.Union[str, int, None] = None

    if isinstance(identity, str) and identity.startswith("https"):
        url = identity if not identity.endswith("/") else identity[:-1]
        parts = url.split("/")

        if len(parts) != 5:
            raise RuntimeError(f"Invalid URL provided '{url}', expected four parts (got {len(parts)})")
        elif parts[2] != "steamcommunity.com":
            raise RuntimeError(f"Invalid URL provided '{url}', expected steamcommunity.com domain")
        elif parts[3] == "id":
            # https://steamcommunity.com/id/nnnnnnnnnnnnnnn/
            resolved_identity = parts[4]
        elif parts[3] == "profiles":
            # https://steamcommunity.com/profiles/00000000000000000/
            resolved_identity = parts[4]
        else:
            raise RuntimeError(f"Invalid URL provided '{url}'")
    else:
        resolved_identity = identity

    try:
        player_id = int(resolved_identity)
    except ValueError:
        # logger.debug(f"Could not convert identity '{resolved_identity}' to Steam ID")
        player_id = resolve_vanity_url(str(resolved_identity))

    return player_id


def query_player(identity: typing.Union[str, int]) -> typing.Optional[Player]:
    """
    Attempt to identify the user from existing data.
    This may fail if the player has changed their persona name
    or URL. In such a case, resolve the identity to attempt to
    load by Player ID.
    """
    return find_existing_player(identity) or player_from_identity(identity)


def load_player(identity: typing.Union[str, int]) -> Player:
    player = query_player(identity)

    if not player:
        logger.error(f"Player '{identity}' does not exist")
        raise Player.DoesNotExist(f"Player '{identity}' does not exist")

    return player


def find_existing_player(identity: typing.Union[str, int]) -> typing.Optional[Player]:
    """Loads an existing player from the database given a player identity"""
    player_id = None
    try:
        player_id = int(identity)
    except ValueError:
        pass

    query = models.Q(id=player_id) | models.Q(name__iexact=str(identity)) | models.Q(profile_url__iexact=str(identity))

    instance = None
    try:
        instance = Player.objects.get(query)
    except Player.DoesNotExist:
        logger.warning(f"Player '{identity}' does not exist")

    return instance


def player_from_identity(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
    """Resolves a player identity and then loads the player (by ID) from the database"""
    instance = None

    player_id = resolve_identity(identity)

    if player_id is not None:
        try:
            instance = Player.objects.get(id=player_id)
        except Player.DoesNotExist:
            logger.warning(f"Player {player_id} (as {identity}) does not exist")

    return instance


def resynchronize_player(player: Player) -> bool:
    ok = False

    try:
        error = False
        if not resynchronize_player_profile(player):
            logger.error(f"Failed to resynchronize player {player.name} profile")
            error = True

        # Resynchronize games from Steam
        if not resynchronize_player_games(player):
            logger.error(f"Failed to resynchronize player {player.name} games")
            error = True

        # Resynchronize recently played games
        if not resynchronize_player_recently_played_games(player):
            logger.error(f"Failed to resynchronize player {player.name} game achievements")
            error = True

        # Resynchronize owned games marked for resynchronization
        if not resynchronize_player_owned_games(player, required_only=True):
            logger.error(f"Failed to resynchronize player {player.name} owned game")
            error = True

        if not error:
            player.resynchronized = timezone.now()
            player.resynchronization_required = False
            player.save(update_fields=["resynchronized", "resynchronization_required"])
            ok = True
    except Exception:
        logger.exception(f"Failed to resynchronize player '{player.name}'")

    return ok


def resynchronize_player_profile(player: Player) -> bool:
    ok = False

    summary = load_player_summary(player.id)

    if summary is not None:
        player.name = summary.personaname
        player.profile_url = summary.profileurl
        player.avatar_small_url = summary.avatar
        player.avatar_medium_url = summary.avatarmedium
        player.avatar_large_url = summary.avatarfull

        player.save()
        ok = True

    return ok


def should_save_playtime_record(playtime: PlayerGamePlaytime, new_playtime: int, *, maximum_frequency=60) -> int:
    delta = timezone.now() - playtime.datetime
    save = False
    if new_playtime == playtime.playtime:
        logger.debug(f"Not saving playtime record for '{playtime.game.name}', playtime has not changed")
    elif delta.seconds < (maximum_frequency * 60):
        logger.debug(
            f"Not saving playtime record for '{playtime.game.name}',"
            f" last recorded {delta.seconds / 60:0.0f} minutes ago"
        )
    else:
        save = True

    return save


def resynchronize_player_games(player: Player) -> bool:
    """Resynchronize player games from Steam data"""
    owned_games = get_owned_games(player.id, player.api_key)
    logger.info(f"Player {player.name} has {len(owned_games)} games")

    # Add / update the Game in the Game table
    # This could be optimized by getting all the IDs of the games the player already owns
    # and bulk updating/creating as required.
    for owned_game in owned_games:
        game_instance, game_created = Game.objects.update_or_create(
            id=owned_game.appid,
            defaults={
                "name": owned_game.name,
                "img_icon_url": owned_game.img_icon_url,
            },
        )

        last_played_time = None
        # rtime_last_played is only available for the owner of the API key,
        # where it is not available, use today if the playtime value has changed.
        if owned_game.rtime_last_played is not None and owned_game.rtime_last_played > 0:
            last_played_time = timezone.make_aware(datetime.fromtimestamp(owned_game.rtime_last_played))

        if owned_game.playtime_2weeks is not None and owned_game.playtime_2weeks > 0:
            logger.debug(f"Player has played {game_instance.name} ({game_instance.id}) recently")
            # Get latest game playtime
            owned_game_playtime = None

            try:
                owned_game_playtime = PlayerGamePlaytime.objects.filter(player=player, game=game_instance).latest(
                    "datetime"
                )
            except PlayerGamePlaytime.DoesNotExist:
                logger.debug(f"Recording first playtime for game {game_instance.name} ({game_instance.id})")
                pass

            if owned_game_playtime is None or should_save_playtime_record(
                owned_game_playtime, owned_game.playtime_2weeks
            ):
                logger.debug(
                    f"Saving playtime record for {player.name} game {game_instance.name} ({owned_game.playtime_2weeks})"
                )
                new_owned_game_playtime = PlayerGamePlaytime(
                    game=game_instance, player=player, playtime=owned_game.playtime_2weeks
                )
                new_owned_game_playtime.save()

                # If rtime_last_played is not available and playtime has changed, update last_played_time
                if owned_game_playtime is None or owned_game.playtime_2weeks > owned_game_playtime.playtime:
                    last_played_time = timezone.make_aware(datetime.combine(date.today(), datetime.min.time()))

        changes = {
            "playtime_forever": owned_game.playtime_forever,
        }

        # Don't overwrite the last played time with no datetime
        if last_played_time is not None:
            changes["last_played"] = last_played_time

        changes["resynchronization_required"] = True if game_created else False

        owned_game_instance, owned_game_created = PlayerOwnedGame.objects.update_or_create(
            game=game_instance,
            player=player,
            defaults=changes,
        )

    # FIXME what would be considered a failure...
    return True


def resynchronize_player_owned_games(player: Player, *, required_only=False) -> bool:
    """Resynchronize player owned games (from the database)"""
    ok = True

    filter = {}
    if required_only:
        filter = {"resynchronization_required": True}

    owned_games = []
    try:
        owned_games = PlayerOwnedGame.objects.filter(player=player, **filter)
        logger.debug(f"Resynchronizing {len(owned_games)} owned games for {player.name}")
    except Exception:
        logger.exception(f"Failed to filter player '{player.name}' owned games")

    for record in owned_games:
        ok &= resynchronize_player_owned_game(player, record)

    return ok


def resynchronize_player_owned_game(player: Player, owned_game: PlayerOwnedGame) -> bool:
    ok = False
    try:
        game = owned_game.game
        resynchronize_game(game)
        resynchronize_player_achievements_for_game(player, game)

        owned_game.resynchronization_required = False
        owned_game.save(update_fields=["resynchronization_required"])
        ok = True
    except Exception:
        logger.exception(f"Failed to resynchronize player '{player.name}' game {owned_game.game.name}")

    return ok


def resynchronize_player_recently_played_games(player: Player) -> bool:
    """Resynchronize players recently played games"""
    ok = True

    threshold = 4
    q = models.Q(player=player, datetime__gte=timezone.now() - timedelta(hours=threshold))
    recent_played_games = PlayerGamePlaytime.objects.filter(q).distinct("game")
    logger.debug(
        f"Player {player.name} has played {len(recent_played_games)} games in the last {threshold} hours, "
        "resynchronizing achievements for played games"
    )

    for record in recent_played_games:
        game = record.game
        resynchronize_game(game)
        resynchronize_player_achievements_for_game(player, game)

    return ok


def resynchronize_player_achievements_for_game(player: Player, game: Game) -> bool:
    ok = False

    game_achievements = game.get_achievements()
    logger.debug(f"Collecting player {player.name} achievements for '{game.name}'")
    player_achievements = get_player_achievements_for_game(player.id, game.id)
    unlocked = list(filter(lambda achievement: achievement.achieved == 1, player_achievements))

    completion_percentage = 0.0
    completion_datetime = None
    game_resynchronization_required = False

    # When the game was last resynchronized there might not have been any achievements.
    # If the player has not unlocked any achievements assume, for now, that the game
    # really doesn't have any achievements
    if len(game_achievements) == 0 and len(player_achievements) == 0:
        logger.debug(f"Game '{game.name}' does not have any achievements")
    else:
        # Check that all unlocked achievements exist in the game achievement list; if not
        # resynchronize the game. This is highly unlikely as most paths to this function
        # resynchronize the game before resynchronizing the player achievements.

        logger.debug(
            f"Player {player.name} has unlocked {len(unlocked)} of "
            f"{len(player_achievements)} achievements in '{game.name}'"
        )

        if len(unlocked) > 0:
            # Get all known game achievements

            for player_achievement in unlocked:
                assert player_achievement.achieved == 1, f"Unexpected achieved value {player_achievement.achieved} for "
                f"player achievement {player_achievement.apiname}"

                game_achievement = next(
                    filter(lambda achievement: achievement.name == player_achievement.apiname, game_achievements), None
                )

                if game_achievement is not None:
                    PlayerUnlockedAchievement.objects.update_or_create(
                        player=player,
                        game=game,
                        achievement=game_achievement,
                        datetime=timezone.make_aware(datetime.utcfromtimestamp(player_achievement.unlocktime)),
                    )
                else:
                    game_resynchronization_required = True
                    logger.error(
                        f"Achievement {player_achievement.apiname} does not exist for game '{game.name}' ({game.id})"
                    )

            completion_percentage = len(unlocked) / len(player_achievements)
            logger.debug(f"Player completion percentage of {completion_percentage} for '{game.name}'")

            if completion_percentage == 1.0:
                try:
                    most_recent = PlayerUnlockedAchievement.objects.filter(player=player, game=game).latest("datetime")
                    completion_datetime = most_recent.datetime
                    logger.debug(f"Player completed '{game.name}' at {completion_datetime}")
                except PlayerUnlockedAchievement.DoesNotExist:
                    pass
            else:
                completion_datetime = None

        # Update the game resynchronization time
        game.resynchronized = timezone.now()
        # Ensure resynchronization doesn't get stuck in a loop
        game.resynchronization_required = not game.resynchronization_required and game_resynchronization_required
        game.save(update_fields=["resynchronized", "resynchronization_required"])

    # Update the player owned game completion percentage and resynchronization time
    owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)
    owned_game.completion_percentage = completion_percentage
    owned_game.completed = completion_datetime
    owned_game.resynchronized = timezone.now()
    owned_game.resynchronization_required = game_resynchronization_required
    owned_game.save(
        update_fields=[
            "completion_percentage",
            "completed",
            "resynchronized",
            "resynchronization_required",
        ]
    )
    ok = True

    return ok
