import logging
import celery
from .models import Game
from .utilities import can_resynchronize_game


def queue_resynchronize_game(game: Game) -> bool:
    queued = False
    if not can_resynchronize_game(game):
        logging.warning(f"Resynchronization of game {game.name} blocked")
    else:
        logging.debug(f"Queuing resynchronization of game {game.name}")
        celery.current_app.send_task("games.tasks.resynchronize_game_task", (game.id,))
        queued = True

    return queued
