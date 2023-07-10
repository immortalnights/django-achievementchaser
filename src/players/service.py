import typing
import logging
from django.db import models
from django.utils import timezone
from games.models import Game
from .models import Player, OwnedGame, GamePlaytime
from .steam import resolve_vanity_url, load_player_summary, get_owned_games


def parse_identity(identity: typing.Union[str, int]) -> typing.Optional[int]:
    player_id = None
    resolved_identity = None

    if identity.startswith("https"):
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


def load_player(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
    """
    Attempt to identify the user from existing data
    This may fail if the player has changed their persona name
    or URL. In such a case, resolve the identity to attempt to
    load by Player ID.
    """
    return find_existing_player(identity) or player_from_identity(identity)


def find_existing_player(identity: typing.Union[str, int]) -> typing.Optional["Player"]:
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


def can_resynchronize_player(player: Player) -> bool:
    ok = False

    RATE_LIMIT = 60

    delta = (timezone.now() - player.resynchronized) if player.resynchronized is not None else -1
    if not player.resynchronization_required and delta.seconds < RATE_LIMIT:
        logging.error(
            f"Cannot resynchronize player {player.name} again for another {RATE_LIMIT - delta.seconds} seconds"
        )
    else:
        ok = True

    return ok


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
    for owned_game in owned_games:
        game_instance, game_created = Game.objects.update_or_create(
            id=owned_game.appid,
            name=owned_game.name,
            img_icon_url=owned_game.img_icon_url,
        )

        owned_game_instance, owned_game_created = OwnedGame.objects.update_or_create(
            game=game_instance, player=player, playtime_forever=owned_game.playtime_forever
        )

        if owned_game.playtime_2weeks is not None:
            # FIXME only add if the play time is different and
            # the last record was more than an hour ago
            owned_game_playtime = GamePlaytime(game=game_instance, player=player, playtime=owned_game.playtime_2weeks)
            owned_game_playtime.save()

    return ok


def resynchronize_player_achievements(self) -> bool:
    return True
