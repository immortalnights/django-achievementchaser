import logging
from typing import TypedDict, Optional, Union
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from .models import Game
from .service import load_game, resynchronize_game
from .utilities import can_resynchronize_game

logger = logging.getLogger()

GameResponse = TypedDict("GameResponse", {"id": int, "name": str, "resynchronized": str})

ResynchronizeGameResponse = TypedDict(
    "ResynchronizeGameResponse", {"ok": bool, "game": Optional[GameResponse], "error": Optional[str]}, total=False
)


@shared_task
def resynchronize_game_task(identity: Union[int, str]) -> ResynchronizeGameResponse:
    """Resolves `identity` to a Game and attempts to resynchronize it.

    The resolution is done here so it's in the worker thread."""

    resp: ResynchronizeGameResponse = {"ok": False}

    game = load_game(identity)

    if game is None:
        raise Game.DoesNotExist(f"Game '{identity}' does not exist")
    else:
        logging.info(f"Beginning resynchronization of game {game.name} ({identity})")
        if can_resynchronize_game(game):
            logging.warning(f"Resynchronization of game {game.name} blocked")
        if resynchronize_game(game):
            logging.info(f"Resynchronization of game {game.name} complete")
            resp = {
                "ok": True,
                "game": {
                    "id": game.id,
                    "name": game.name,
                    "resynchronized": game.resynchronized,
                },
            }
        else:
            logging.info(f"Resynchronization of game {game.name} failed")

    return resp
