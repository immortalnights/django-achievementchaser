from loguru import logger
from typing import TypedDict, Union, Optional
from datetime import timedelta
import time
from django.db.models import Q
from django.utils import timezone
from .models import Player, PlayerOwnedGame
from .service import load_player, resynchronize_player, resynchronize_player_achievements_for_game
from achievementchaser.utilities import can_resynchronize_model
from games.service import load_game, resynchronize_game
from games.models import Game


PlayerResponse = TypedDict("PlayerResponse", {"id": int, "name": str, "resynchronized": Optional[str]}, total=False)
OwnedGameResponse = TypedDict("OwnedGameResponse", {"id": int, "name": str, "resynchronized": str})

ResynchronizePlayerResponse = TypedDict(
    "ResynchronizePlayerResponse", {"ok": bool, "player": Optional[PlayerResponse], "error": Optional[str]}, total=False
)

ResynchronizePlayerGameResponse = TypedDict(
    "ResynchronizePlayerGameResponse",
    {"ok": bool, "player": Optional[PlayerResponse], "owned_game": Optional[OwnedGameResponse], "error": Optional[str]},
    total=False,
)


def resynchronize_players_task():
    """Resynchronize players that are flagged for resynchronization or have not been resynchronized recently
    Players are resynchronized every hour (there wont ever be many players).
    """
    logger.debug("Begin resynchronization of players")

    due = timezone.now() - timedelta(minutes=10)

    logger.debug(f"Find players last resynchronized before {due}")
    query = Q(resynchronization_required=True) | Q(resynchronized__lt=due)
    players = Player.objects.filter(query)
    logger.debug(f"Found {players.count()} players which require resynchronization")

    # Prevent excessive work if, somehow, there are many players
    limit = 10
    players = players[:limit]

    logger.debug(f"Resynchronizing {players.count()} players")
    for player in players:
        resynchronize_player_task(player.id)


def resynchronize_players_owned_games_task():
    """Resynchronize player owned games that are flagged for resynchronization.
    Intended for when a new player is added.
    """
    logger.debug("Begin resynchronization of players owned games")
    owned_games = PlayerOwnedGame.objects.filter(resynchronization_required=True)
    logger.debug(f"Found {owned_games.count()} owned games which require resynchronization")

    # Prevent excessive work in one event
    limit = 50
    owned_games = owned_games[:limit]

    logger.debug(f"Resynchronizing {owned_games.count()} owned games")
    for owned_game in owned_games:
        resynchronize_player_game_task(owned_game.player_id, owned_game.game_id)

        # Prevent overwhelming the Steam API
        time.sleep(1)


def resynchronize_player_task(identity: Union[str, int]) -> Optional[bool]:
    """Resolves `identity` to a Player and attempts to resynchronize them.

    The resolution is done here so it's in the worker thread."""
    ok = False

    player = load_player(identity)

    if player is None:
        raise Player.DoesNotExist(f"Player '{identity}' does not exist")
    else:
        logger.info(f"Beginning resynchronization of Player {player.name} ({player.id})")

        if not can_resynchronize_model(player):
            logger.warning(f"Resynchronization of player {player.name} blocked")
        elif not resynchronize_player(player):
            logger.warning(f"Resynchronization of player {player.name} failed")
        else:
            logger.info(f"Resynchronization of player {player.name} complete")
            ok = True

    return ok


def resynchronize_player_game_task(
    player_identifier: Union[str, int], game_identifier: Union[str, int]
) -> ResynchronizePlayerGameResponse:
    """TODO: Resolves `player` to a Player and `game` to a Game and attempts
    to resynchronize them.

    The resolution is done here so it's in the worker thread."""
    ok = False

    try:
        player = load_player(player_identifier)
        game = load_game(game_identifier)

        # Use owned game to prevent spam
        owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)
        if can_resynchronize_model(owned_game):
            resynchronize_game(game)
            resynchronize_player_achievements_for_game(player, game)

            owned_game.refresh_from_db()
            ok = True
        else:
            logger.warning(f"Resynchronization of player {player.name} owned game {game.name} blocked")
    except Player.DoesNotExist:
        logger.error(f"Failed to find player {player}")
    except Game.DoesNotExist:
        logger.error(f"Failed to find game {game}")
    except PlayerOwnedGame.DoesNotExist:
        logger.error(f"Failed to find player {player.name} game {game.name}")

    return {
        "ok": ok,
        "player": {
            "id": player.id,
            "name": player.name,
        },
        "owned_game": {
            "id": game.id,
            "name": game.name,
            "resynchronized": owned_game.resynchronized,
        },
        "error": None,
    }
