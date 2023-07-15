import logging
import typing
from celery import shared_task
from celery.utils.log import get_task_logger  # noqa F401
from .models import Player
from .service import load_player, resynchronize_player, resynchronize_player_achievements_for_game
from .utilities import can_resynchronize_player
from games.models import Game

logger = logging.getLogger()


@shared_task
def resynchronize_player_task(identity: typing.Union[str, int]) -> typing.Optional[bool]:
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


@shared_task
def resynchronize_player_game_task(player: int, game: int) -> typing.Optional[bool]:
    ok = False

    try:
        player = Player.objects.get(id=player)
        game = Game.objects.get(id=game)

        resynchronize_player_achievements_for_game(player, game)
        ok = True
    except Player.DoesNotExist:
        logging.error(f"Failed to find player {player}")
    except Game.DoesNotExist:
        logging.error(f"Failed to find game {game}")

    return ok
