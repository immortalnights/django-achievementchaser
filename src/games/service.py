import logging
from django.utils import timezone
from .models import Game
from .steam import load_game_schema
from achievements.service import save_achievements, resynchronize_game_achievements


def resynchronize_game(game: Game, *, resynchronize_achievements: bool = True) -> bool:
    ok = False

    try:
        resynchronize_game_schema(game)

        if resynchronize_achievements:
            resynchronize_game_achievements(game)

        # Resynchronization completed successful
        game.resynchronized = timezone.now()
        game.resynchronization_required = False
        game.save()
        ok = True
    except Exception:
        logging.exception(f"Failed to resynchronize game {game.name}")

    return ok


def resynchronize_game_schema(game: Game) -> bool:
    ok = False

    schema = load_game_schema(game.id)

    if schema is not None:
        # Don't overwrite the name if it's already set
        if not game.name:
            game.name = schema.gameName
        elif game.name != schema.gameName:
            logging.warning(f"Game name mismatch {game.name} vs {schema.gameName} ({game.id})")

        # Save the changes to the game
        game.save()

        # Save the achievements
        save_achievements(game, schema.availableGameStats.achievements)

        ok = True

    return ok