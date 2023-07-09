import logging
import typing
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from .models import Game
from .service import resynchronize_game as resynchronize_game_service

logger = logging.getLogger()


@shared_task
def resynchronize_game_task(identity: str) -> typing.Union[bool, Exception]:
    ok = False

    game_instance = None
    try:
        game_instance = Game.objects.get(id=identity)

        logging.info(f"Beginning resynchronization of Game {game_instance.name} ({identity})")
        if resynchronize_game_service(game_instance):
            logging.info(f"Resynchronization of game {game_instance.name} complete")
            ok = True
        else:
            logging.info(f"Resynchronization of game {game_instance.name} failed")
    except Game.DoesNotExist:
        logging.error(f"Game '{identity}' does not exist")

    return ok
