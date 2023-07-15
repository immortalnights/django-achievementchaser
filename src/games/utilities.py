import logging
from django.utils import timezone
from .models import Game


def can_resynchronize_game(game: Game) -> bool:
    ok = False
    RATE_LIMIT = 60

    delta = (timezone.now() - game.resynchronized) if game.resynchronized is not None else -1
    if not game.resynchronization_required and delta.seconds < RATE_LIMIT:
        logging.error(f"Cannot resynchronize game {game.name} again for another {RATE_LIMIT - delta.seconds} seconds")
    else:
        ok = True

    return ok
