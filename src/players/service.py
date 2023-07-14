import typing
import logging
from datetime import datetime, timedelta
from django.db import models, transaction
from django.utils import timezone
from games.models import Game
from games.queue import queue_resynchronize_game
from achievements.models import Achievement
from .models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement
from .steam import resolve_vanity_url, load_player_summary, get_owned_games, get_player_achievements_for_game
from .queue import queue_resynchronize_player_game
from .responsedata import PlayerUnlockedAchievementResponse


def parse_identity(identity: typing.Union[str, int]) -> typing.Optional[int]:
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
        # logging.debug(f"Could not convert identity '{resolved_identity}' to Steam ID")
        player_id = resolve_vanity_url(resolved_identity)

    return player_id


def load_player(identity: typing.Union[str, int]) -> typing.Optional[Player]:
    """
    Attempt to identify the user from existing data
    This may fail if the player has changed their persona name
    or URL. In such a case, resolve the identity to attempt to
    load by Player ID.
    """
    return find_existing_player(identity) or player_from_identity(identity)


def find_existing_player(identity: typing.Union[str, int]) -> typing.Optional[Player]:
    """Loads an existing player from the database given a player identity"""
    player_id = None
    try:
        player_id = int(identity)
    except ValueError:
        pass

    query = models.Q(id=player_id) | models.Q(name__iexact=str(identity)) | models.Q(profile_url__iexact=str(identity))
    logging.debug(query)

    instance = None
    try:
        instance = Player.objects.get(query)
    except Player.DoesNotExist:
        logging.warning(f"Player {identity} does not exist")

    return instance


def player_from_identity(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
    """Resolves a player identity and then loads the player (by ID) from the database"""
    instance = None

    player_id = parse_identity(identity)

    if player_id is not None:
        try:
            instance = Player.objects.get(id=player_id)
        except Player.DoesNotExist:
            logging.warning(f"Player {identity} does not exist")

    return instance


def resynchronize_player(player: Player) -> bool:
    ok = False

    try:
        ok = resynchronize_player_profile(player)
        ok &= resynchronize_player_games(player)
        ok &= resynchronize_player_achievements(player)

        if ok is True:
            player.resynchronized = timezone.now()
            player.resynchronization_required = False
            player.save()
    except Exception:
        logging.exception(f"Failed to resynchronize player '{player.name}'")

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


def resynchronize_player_games(player: Player) -> bool:
    ok = False

    owned_games = get_owned_games(player.id)
    logging.info(f"Player {player.name} has {len(owned_games)} games")

    # Add / update the Game in the Game table
    # This could be optimized by getting all the IDs of the games the player already owns
    # and bulk updating/creating as required.
    for owned_game in owned_games:
        game_instance, game_created = Game.objects.update_or_create(
            id=owned_game.appid,
            name=owned_game.name,
            img_icon_url=owned_game.img_icon_url,
        )

        owned_game_instance, owned_game_created = PlayerOwnedGame.objects.update_or_create(
            game=game_instance,
            player=player,
            playtime_forever=owned_game.playtime_forever,
        )

        if owned_game.playtime_2weeks is not None:
            # FIXME only add if the play time is different and
            # the last record was more than an hour ago
            owned_game_playtime = PlayerGamePlaytime(
                game=game_instance, player=player, playtime=owned_game.playtime_2weeks
            )
            owned_game_playtime.save()

    return ok


def resynchronize_player_achievements(player: Player) -> bool:
    """Resynchronize player achievements for recently played games"""
    ok = False

    q = models.Q(player=player, datetime__gte=timezone.now() - timedelta(hours=4))
    recent_played_games = PlayerGamePlaytime.objects.filter(q).distinct("game")
    # logging.debug(recent_games.query)
    logging.debug(f"Resynchronizing achievements for {len(recent_played_games)} games for {player.name}")

    for record in recent_played_games:
        game = record.game
        resynchronize_player_achievements_for_game(player, game, resynchronize_when_missing=True)

    return ok


def resynchronize_player_achievements_for_game(player: Player, game: Game, *, resynchronize_when_missing = False):
    logging.debug(f"Collecting player {player.name} achievements for '{game.name}'")
    player_achievements = get_player_achievements_for_game(player.id, game.id)
    unlocked = list(filter(lambda achievement: achievement.achieved == 1, player_achievements))

    if len(player_achievements) > 0:
        logging.debug(
            f"Player {player.name} has unlocked {len(unlocked)} of "
            f"{len(player_achievements)} achievements in {game.name}"
        )
    else:
        logging.debug(f"Game {game.name} does not have any achievements")

    game_resynchronization_required = False

    if len(unlocked) > 0:
        # Get all known game achievements
        game_achievements = Achievement.objects.filter(game=game.id)

        for player_achievement in unlocked:
            assert player_achievement.achieved == 1, f"Unexpected achieved value {player_achievement.achieved} for player achievement {player_achievement.apiname}"

            game_achievement = next(filter(lambda achievement: achievement.name == player_achievement.apiname, game_achievements), None)
            if game_achievement is not None:
                PlayerUnlockedAchievement.objects.update_or_create(
                    player=player,
                    game=game,
                    achievement=game_achievement,
                    datetime=timezone.make_aware(datetime.utcfromtimestamp(player_achievement.unlocktime))
                )
            else:
                game_resynchronization_required = True
                logging.error(
                    f"Achievement {player_achievement.apiname} does not "
                    f"exist for game {game.name} ({game.id})"
                )

    # Update the game resynchronization time
    game.resynchronized = timezone.now()
    game.resynchronization_required = game_resynchronization_required
    game.save(update_fields=["resynchronized", "resynchronization_required"])

    # Update the owned game resynchronization time
    try:
        owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)
        owned_game.achievements_resynchronized = timezone.now()
        owned_game.achievements_resynchronization_required = game_resynchronization_required
        owned_game.save(update_fields=["achievements_resynchronized", "achievements_resynchronization_required"])
    except PlayerOwnedGame.DoesNotExist:
        pass

    # If there were any unknown achievements (and auto-resynchronization is permitted)
    # queue a resynchronization of the game and player achievements.
    if game_resynchronization_required and resynchronize_when_missing:
        queue_resynchronize_game(game)
        queue_resynchronize_player_game(player, game)
