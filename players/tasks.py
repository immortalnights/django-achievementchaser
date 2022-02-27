import time
from players.models import Player
from celery import shared_task
import logging
from celery.utils.log import get_task_logger
import players.management.commands.resynchronize_player

# logger = get_task_logger("players")
logger = logging.getLogger()


@shared_task
def resynchronize_player(id: int):
    # print("beginning")
    logger.info(f"Beginning resynchronization of Player {id}")
    players.management.commands.resynchronize_player.resynchronize_player(logger, id)
    # time.sleep(5)
    # print("done")
    return f"Done {id} X"
