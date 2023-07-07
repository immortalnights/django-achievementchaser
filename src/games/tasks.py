import logging
import typing
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from .models import Game
from .service import resynchronize_game as resynchronize_game_service
from achievementchaser.management.lib.IOutput import IOutput

logger = logging.getLogger()


def resynchronize_game(output: IOutput, identity: str):
    ok = False

    game_instance = None
    try:
        game_instance = Game.objects.get(id=identity)
    except Game.DoesNotExist:
        # FIXME Normally games shouldn't need to be created when
        # they are resynchronized
        # The new game should not be saved until we can verify it's valid
        game_instance = Game(id=identity)
        game_instance.save()

    if game_instance is not None:
        output.info(f"Beginning resynchronization of Game {game_instance.name} ({identity})")

        if resynchronize_game_service(game_instance):
            output.info(f"Resynchronization of game {game_instance.name} complete")
            ok = True
        else:
            output.info(f"Resynchronization of game {game_instance.name} failed")

    return ok


@shared_task
def resynchronize_player_task(identity: str):
    return resynchronize_game(logger, identity)
