import logging
from typing import Union
from django.utils import timezone
from players.models import Player, PlayerOwnedGame
from games.models import Game


def can_resynchronize_model(model: Union[Player, PlayerOwnedGame, Game], rate_limit: int = 60):
    ok = False

    delta = (timezone.now() - model.resynchronized) if model.resynchronized is not None else -1
    if not model.resynchronization_required and delta.seconds < rate_limit:
        logging.error(f"Cannot resynchronize {model} again for another {rate_limit - delta.seconds} seconds")
    else:
        ok = True
    return ok


# def can_resynchronize_player_game(player: Player, game: Game) -> bool:
#     ok = False

#     RATE_LIMIT = 60

#     try:
#         owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)

#         delta = (timezone.now() - owned_game.achievements_resynchronized) if owned_game.achievements_resynchronized is not None else -1
#         if not owned_game.achievements_resynchronization_required and delta.seconds < RATE_LIMIT:
#             logging.error(
#                 f"Cannot resynchronize player {player.name} game {game.id} again for another {RATE_LIMIT - delta.seconds} seconds"
#             )
#         else:
#             ok = True
#     except PlayerOwnedGame.DoesNotExist:
#         logging.error(f"Failed to get player {player.name} owned game {game.name}")

#     return ok


# def can_resynchronize_player(player: Player) -> bool:
#     ok = False

#     RATE_LIMIT = 60

#     delta = (timezone.now() - player.resynchronized) if player.resynchronized is not None else -1
#     if not player.resynchronization_required and delta.seconds < RATE_LIMIT:
#         logging.error(
#             f"Cannot resynchronize player {player.name} again for another {RATE_LIMIT - delta.seconds} seconds"
#         )
#     else:
#         ok = True

#     return ok

# def can_resynchronize_game(game: Game) -> bool:
#     ok = False
#     RATE_LIMIT = 60

#     delta = (timezone.now() - game.resynchronized) if game.resynchronized is not None else -1
#     if not game.resynchronization_required and delta.seconds < RATE_LIMIT:
#         logging.error(f"Cannot resynchronize game {game.name} again for another {RATE_LIMIT - delta.seconds} seconds")
#     else:
#         ok = True

#     return ok
