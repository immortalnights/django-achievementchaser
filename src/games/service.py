from typing import Optional, Union, List
from loguru import logger
from django.db.models import Q
from django.utils import timezone
from .responsedata import GameAchievementResponse
from .models import Game, Achievement
from .steam import load_game_schema, load_game_achievement_percentages


def query_game(identity: Union[int, str]) -> Optional[Game]:
    query = None
    try:
        query = Q(id=int(identity))
    except ValueError:
        query = Q(name__iexact=identity)

    try:
        instance = Game.objects.get(query)
    except Game.DoesNotExist:
        logger.warning(f"Game '{identity}' does not exist")

    return instance


def load_game(identity: Union[int, str]) -> Game:
    game = query_game(identity)

    if not game:
        logger.error(f"game '{identity}' does not exist")
        raise Game.DoesNotExist(f"game '{identity}' does not exist")

    return game


def resynchronize_game(game: Game, *, resynchronize_achievements: bool = True) -> bool:
    ok = False

    try:
        logger.debug(f"Resynchronizing game '{game.name}' ({game.id})")
        resynchronize_game_schema(game)

        if resynchronize_achievements:
            if game.has_achievements():
                resynchronize_game_achievements(game)
            else:
                logger.debug(f"Game '{game.name}' does not have any achievements")

        # Resynchronization completed successful
        game.resynchronized = timezone.now()
        game.resynchronization_required = False
        game.save()
        ok = True
    except Exception:
        logger.exception(f"Failed to resynchronize game '{game.name}'")

    return ok


def resynchronize_game_schema(game: Game) -> bool:
    ok = False

    schema = load_game_schema(game.id)

    if schema is not None:
        # Don't overwrite the name if it's already set
        if not game.name:
            game.name = schema.gameName
        elif game.name != schema.gameName:
            logger.warning(f"Game name mismatch '{game.name}' vs {schema.gameName} ({game.id})")

        # Save the changes to the game
        game.save()

        # Save the achievements
        save_achievements(game, schema.availableGameStats.achievements)

        ok = True

    return ok


def save_achievements(game: Game, achievements: List[GameAchievementResponse]) -> None:
    logger.debug(f"Saving {len(achievements)} achievements for game '{game.name}' ({game.id})")

    for achievement in achievements:
        achievement_instance, achievement_created = Achievement.objects.update_or_create(
            name=achievement.name,
            game=game,
            defaults={
                "default_value": achievement.defaultvalue,
                "display_name": achievement.displayName,
                "hidden": achievement.hidden,
                "description": achievement.description,
                "icon_url": achievement.icon,
                "icon_gray_url": achievement.icongray,
            },
        )


def resynchronize_game_achievements(game: Game) -> bool:
    ok = False
    logger.debug(f"Loading global achievement percentages for game '{game.name}' ({game.id})")
    achievement_percentages = load_game_achievement_percentages(game.id)

    if achievement_percentages is not None:
        total_percentage = 0.0
        lowest_percentage = 0.0
        # Save achievement percentages
        for achievement in achievement_percentages.achievements:
            total_percentage += achievement.percent

            if lowest_percentage == 0.0 or achievement.percent < lowest_percentage:
                lowest_percentage = achievement.percent

            try:
                instance = Achievement.objects.get(name=achievement.name, game=game)
                instance.global_percentage = achievement.percent
                instance.save(update_fields=["global_percentage"])
            except Achievement.DoesNotExist:
                logger.error(f"Achievement {achievement.name} not found for game '{game.name}' ({game.id})")

        average_difficulty = total_percentage / len(achievement_percentages.achievements)
        logger.debug(f"Game '{game.name}' difficulty is {lowest_percentage}, {average_difficulty} average")
        game.difficulty_percentage = lowest_percentage
        game.save(update_fields=["difficulty_percentage"])

        ok = True

    return ok
