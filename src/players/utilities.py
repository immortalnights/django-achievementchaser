import logging
from django.utils import timezone
from .models import Player, PlayerOwnedGame
from games.models import Game

def can_resynchronize_player(player: Player) -> bool:
    ok = False

    RATE_LIMIT = 60

    delta = (timezone.now() - player.resynchronized) if player.resynchronized is not None else -1
    if not player.resynchronization_required and delta.seconds < RATE_LIMIT:
        logging.error(
            f"Cannot resynchronize player {player.name} again for another {RATE_LIMIT - delta.seconds} seconds"
        )
    else:
        ok = True

    return ok

def can_resynchronize_player_game(player: Player, game: Game) -> bool:
    ok = False

    RATE_LIMIT = 60

    try:
        owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)

        delta = (timezone.now() - owned_game.achievements_resynchronized) if owned_game.achievements_resynchronized is not None else -1
        if not owned_game.achievements_resynchronization_required and delta.seconds < RATE_LIMIT:
            logging.error(
                f"Cannot resynchronize player {player.name} game {game.id} again for another {RATE_LIMIT - delta.seconds} seconds"
            )
        else:
            ok = True
    except PlayerOwnedGame.DoesNotExist:
        logging.error(f"Failed to get player {player.name} owned game {game.name}")

    return ok
