import logging
import typing
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from players.models import Player
from achievementchaser.management.lib.IOutput import IOutput

logger = logging.getLogger()


def resynchronize_player(output: IOutput, identity: typing.Union[str, int]):
    ok = False
    player_instance = Player.load(identity)

    if player_instance is not None:
        output.info(f"Beginning resynchronization of Player {player_instance.personaname} ({identity})")

        if player_instance.resynchronize():
            output.info(f"Resynchronization of player {player_instance.personaname} complete")
            ok = True
        else:
            output.info(f"Resynchronization of player {player_instance.personaname} failed")

    return ok


@shared_task
def resynchronize_player_task(identity: typing.Union[str, int]):
    return resynchronize_player(logger, identity)
