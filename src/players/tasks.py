import logging
from typing import TypedDict, Union, Optional
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from .models import Player, PlayerOwnedGame
from .service import load_player, resynchronize_player, resynchronize_player_achievements_for_game
from achievementchaser.utilities import can_resynchronize_model

# from .utilities import can_resynchronize_player
from games.service import load_game, resynchronize_game
from games.models import Game

logger = logging.getLogger()


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


@shared_task
def resynchronize_player_task(identity: Union[str, int]) -> Optional[bool]:
    """Resolves `identity` to a Player and attempts to resynchronize them.

    The resolution is done here so it's in the worker thread."""
    ok = False

    player = load_player(identity)

    if player is None:
        raise Player.DoesNotExist(f"Player '{identity}' does not exist")
    else:
        logging.info(f"Beginning resynchronization of Player {player.name} ({player.id})")

        if not can_resynchronize_model(player):
            logging.warning(f"Resynchronization of player {player.name} blocked")
        elif not resynchronize_player(player):
            logging.warning(f"Resynchronization of player {player.name} failed")
        else:
            logging.info(f"Resynchronization of player {player.name} complete")
            ok = True

    return ok


@shared_task
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
            logging.warning(f"Resynchronization of player {player.name} owned game game {game.name} blocked")
    except Player.DoesNotExist:
        logging.error(f"Failed to find player {player}")
    except Game.DoesNotExist:
        logging.error(f"Failed to find game {game}")
    except PlayerOwnedGame.DoesNotExist:
        logging.error(f"Failed to find player {player.name} game {game.name}")

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
