from typing import Optional, Union, List
from loguru import logger
from django.db.models import Q
from django.utils import timezone
from .responsedata import GameAchievementResponse
from .models import Game, Achievement
from .steam import load_game_schema, load_game_achievement_percentages
from players.models import PlayerOwnedGame


def query_game(identity: Union[int, str]) -> Optional[Game]:
    query = None
    try:
        query = Q(id=int(identity))
    except ValueError:
        query = Q(name__iexact=identity)

    instance = None
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


def resynchronize_game(game: Game) -> bool:
    ok = False

    try:
        logger.debug(f"Resynchronizing game '{game.name}' ({game.id})")

        original_achievement_count = len(game.get_achievements())

        resynchronize_game_schema(game)

        updated_achievement_count = len(game.get_achievements())

        # The achievement percentages can change, even if the number of achievements remain the same
        if updated_achievement_count > 0:
            logger.debug(
                f"Game '{game.name}' has {updated_achievement_count} achievements (previously {original_achievement_count})"
            )
            resynchronize_game_achievement_percentages(game)
        else:
            logger.debug(f"Game '{game.name}' does not have any achievements")

        # Resynchronization completed successful
        game.resynchronized = timezone.now()
        game.resynchronization_required = False
        game.save()

        # If the number of achievements have changes, some players may no longer have all achievements unlocked
        if updated_achievement_count > 0:
            if original_achievement_count != updated_achievement_count:
                logger.debug(
                    f"Game '{game.name}' has changed the number of achievements, marking all owned games for resynchronization"
                )
                owned_games = PlayerOwnedGame.objects.filter(game=game)
                for owned_game in owned_games:
                    owned_game.resynchronization_required = True
                    owned_game.save(update_fields=["resynchronization_required"])

        ok = True
    except Exception:
        logger.exception(f"Failed to resynchronize game '{game.name}'")

    return ok


def resynchronize_game_schema(game: Game) -> bool:
    """Updates the db game with data from Steam, including game achievements"""
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


def resynchronize_game_achievement_percentages(game: Game) -> bool:
    ok = False
    logger.debug(f"Loading global achievement percentages for game '{game.name}' ({game.id})")
    achievement_percentages = load_game_achievement_percentages(game.id)

    # FIXME If a game schema includes an achievement but the global percentage data does not
    # nothing is done. This could be an API data issue, but should be handled better.

    if achievement_percentages is not None and len(achievement_percentages.achievements) > 0:
        total_percentage = 0.0
        lowest_percentage = None
        # Save achievement percentages
        for achievement in achievement_percentages.achievements:
            total_percentage += achievement.percent
            # logger.debug(f"Achievement {achievement.name} has a percentage of {achievement.percent}")

            if lowest_percentage is None or achievement.percent < lowest_percentage:
                lowest_percentage = achievement.percent

            try:
                instance = Achievement.objects.get(name=achievement.name, game=game)
                instance.global_percentage = achievement.percent
                instance.save(update_fields=["global_percentage"])
            except Achievement.DoesNotExist:
                # Achievement existed in global percentage data, but not in the game schema.
                # This would suggest an issue with the API data.
                logger.error(f"Achievement {achievement.name} not found for game '{game.name}' ({game.id})")

        average_difficulty = 0.0
        if total_percentage > 0:
            average_difficulty = round(total_percentage / len(achievement_percentages.achievements), 3)

        game.difficulty_percentage = lowest_percentage
        logger.debug(
            f"Saving game difficulty percentage {lowest_percentage}, {average_difficulty} average for game '{game.name}' ({game.id})"
        )
        game.save(update_fields=["difficulty_percentage"])

        ok = True
    else:
        logger.debug(f"Game '{game.name}' does not include any achievements")

    return ok
