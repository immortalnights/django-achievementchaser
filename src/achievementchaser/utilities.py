from django.utils import timezone
from loguru import logger

from games.models import Game
from players.models import Player, PlayerOwnedGame


def can_resynchronize_model(model: Player | PlayerOwnedGame | Game, rate_limit: int = 60):
    ok = False

    delta = (timezone.now() - model.resynchronized) if model.resynchronized is not None else None
    if model.resynchronization_required or not delta:
        ok = True
    elif delta.seconds < rate_limit:
        logger.error(f"Cannot resynchronize {model} again for another {rate_limit - delta.seconds} seconds")
    else:
        ok = True

    return ok
