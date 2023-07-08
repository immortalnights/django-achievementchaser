import logging
import typing
from games.models import Game
from games.responsedata import GameAchievement
from .models import Achievement
from .steam import load_game_achievement_percentages


def save_achievements(game: Game, achievements: typing.List[GameAchievement]) -> None:
    logging.debug(f"Saving {len(achievements)} achievements for game {game.name}")

    for achievement in achievements:
        achievement_instance = Achievement(
            name=achievement.name,
            game=game,
            default_value=achievement.defaultvalue,
            display_name=achievement.displayName,
            hidden=achievement.hidden,
            description=achievement.description,
            icon_url=achievement.icon,
            icon_gray_url=achievement.icongray,
        )
        achievement_instance.save()


def resynchronize_game_achievements(game: Game) -> bool:
    ok = False
    achievement_percentages = load_game_achievement_percentages(game.id)

    if achievement_percentages is not None:
        # Save achievement percentages
        for achievement in achievement_percentages.achievements:
            try:
                instance = Achievement.objects.get(name=achievement.name)
                instance.global_percentage = achievement.percentage
                instance.save()
            except Achievement.DoesNotExist:
                logging.error(f"Achievement {achievement.name} not found for game {game.name} ({game.id})")

        ok = True

    return ok
