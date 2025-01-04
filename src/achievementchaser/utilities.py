from typing import Union
from loguru import logger
from django.utils import timezone
from players.models import Player, PlayerOwnedGame
from games.models import Game


def can_resynchronize_model(model: Union[Player, PlayerOwnedGame, Game], rate_limit: int = 60):
    ok = False

    delta = (timezone.now() - model.resynchronized) if model.resynchronized is not None else None
    if model.resynchronization_required or not delta:
        ok = True
    elif delta.seconds < rate_limit:
        logger.error(f"Cannot resynchronize {model} again for another {rate_limit - delta.seconds} seconds")
    else:
        ok = True

    return ok
