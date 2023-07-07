import logging
import typing
from games.models import Game
from games.responsedata import GameAchievement
from .models import Achievement


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
