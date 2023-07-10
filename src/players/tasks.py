import logging
import typing
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from players.models import Player
from players.service import load_player, can_resynchronize_player, resynchronize_player

logger = logging.getLogger()


@shared_task
def resynchronize_player_task(identity: typing.Union[str, int]) -> typing.Union[bool, Exception]:
    ok = False

    player = load_player(identity)

    if player is None:
        raise Player.DoesNotExist(f"Player '{identity}' does not exist")
    else:
        logging.info(f"Beginning resynchronization of Player {player.name} ({identity})")

        if not can_resynchronize_player(player):
            logging.warning(f"Resynchronization of player {player.name} blocked")
        elif not resynchronize_player(player):
            logging.warning(f"Resynchronization of player {player.name} failed")
        else:
            logging.info(f"Resynchronization of player {player.name} complete")
            ok = True

    return ok
