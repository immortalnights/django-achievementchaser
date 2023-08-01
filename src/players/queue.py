import logging
import celery
from games.models import Game
from .models import Player
from achievementchaser.utilities import can_resynchronize_model

# from .utilities import can_resynchronize_player, can_resynchronize_player_game


def queue_resynchronize_player(player: Player):
    queued = False
    if not can_resynchronize_player(player):
        logging.warning(f"Resynchronization of player {player.name} blocked")
    else:
        logging.debug(f"Queuing resynchronization of player {player.name}")
        celery.current_app.send_task("players.tasks.resynchronize_player_task", (player.id,))
        queued = True

    return queued


def queue_resynchronize_player_game(player: Player, game: Game):
    queued = False
    if not can_resynchronize_player_game(player, game):
        logging.warning(f"Resynchronization of player {player.name} game {game.name} blocked")
    else:
        logging.debug(f"Queuing resynchronization of {game.name} for {player.name}")
        celery.current_app.send_task("players.tasks.resynchronize_player_game_task", (player.id, game.id))
        queued = True

    return queued
