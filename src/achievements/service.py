import typing
from loguru import logger
from games.models import Game
from games.responsedata import GameAchievementResponse
from .models import Achievement
from .steam import load_game_achievement_percentages


def save_achievements(game: Game, achievements: typing.List[GameAchievementResponse]) -> None:
    logger.debug(f"Saving {len(achievements)} achievements for game {game.name} ({game.id})")

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
    achievement_percentages = load_game_achievement_percentages(game.id)

    if achievement_percentages is not None:
        total_percentage = 0
        # Save achievement percentages
        for achievement in achievement_percentages.achievements:
            total_percentage += achievement.percent

            try:
                instance = Achievement.objects.get(name=achievement.name, game=game)
                instance.global_percentage = achievement.percent
                instance.save(update_fields=["global_percentage"])
            except Achievement.DoesNotExist:
                logger.error(f"Achievement {achievement.name} not found for game {game.name} ({game.id})")

        game.difficulty_percentage = total_percentage / len(achievement_percentages.achievements)
        game.save(update_fields=["difficulty_percentage"])

        ok = True

    return ok
