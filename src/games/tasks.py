import time
from datetime import timedelta
from typing import TypedDict

from django.db.models import Q
from django.utils import timezone
from loguru import logger

from achievementchaser.utilities import can_resynchronize_model

from .models import Game
from .service import load_game, resynchronize_game

ResynchronizeGameResponse = TypedDict(
    "ResynchronizeGameResponse", {"ok": bool, "game": Game | None, "error": str | None}, total=False
)


def resynchronize_games_task():
    """Resynchronize games that are flagged for resynchronization or have not been resynchronized recently"""
    logger.debug("Begin resynchronization of games")

    due = timezone.now() - timedelta(days=14)

    logger.debug(f"Find games last resynchronized before {due}")
    query = Q(resynchronization_required=True) | Q(resynchronized__lt=due)
    games = Game.objects.filter(query)
    logger.debug(f"Found {games.count()} games which require resynchronization")

    # Prevent excessive work in one event
    limit = 10
    games = games[:limit]

    logger.debug(f"Resynchronizing {games.count()} games")
    for game in games:
        resynchronize_game_task(game.id)

        # Prevent overwhelming the Steam API
        time.sleep(1)


def resynchronize_game_task(identity: int | str) -> ResynchronizeGameResponse:
    """Resolves `identity` to a Game and attempts to resynchronize it.

    The resolution is done here so it's in the worker thread."""

    resp: ResynchronizeGameResponse = {"ok": False}

    try:
        game = load_game(identity)

        logger.info(f"Beginning resynchronization of game '{game.name}' ({identity})")
        if not can_resynchronize_model(game):
            logger.warning(f"Resynchronization of game '{game.name}' blocked")
        elif resynchronize_game(game):
            logger.info(f"Resynchronization of game '{game.name}' complete")
            resp = {"ok": True, "game": game}
        else:
            logger.error(f"Resynchronization of game '{game.name}' failed")
    except Game.DoesNotExist:
        pass

    return resp
