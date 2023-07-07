import logging
import typing
from django.utils import timezone
from .models import Game
from .steam import load_game_schema
from .responsedata import GameSchema
from achievements.service import save_achievements


def resynchronize_game(game: Game) -> bool:
    ok = False

    RATE_LIMIT = 60

    delta = (timezone.now() - game.resynchronized) if game.resynchronized is not None else -1
    if not game.resynchronization_required and delta.seconds < RATE_LIMIT:
        logging.error(f"Cannot resynchronize game {game.name} again for another {RATE_LIMIT - delta.seconds} seconds")
    else:
        schema = load_game_schema(game.id)

        if schema is None:
            logging.error(f"Received no schema for game {game.id}")
        else:
            _apply_game_schema(game, schema)
            save_achievements(game, schema.availableGameStats.achievements)
            game.resynchronization_required = False
            game.save()
            ok = True

    return ok


def _apply_game_schema(game: Game, schema: GameSchema) -> None:
    if not game.name:
        game.name = schema.gameName

    # gameVersion is currently not saved
    game.resynchronized = timezone.now()
