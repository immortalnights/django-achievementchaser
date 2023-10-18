# Generated by Django 4.2.2 on 2023-10-18 22:18

from django.db import migrations
from loguru import logger


def set_player_game_completed_properly(apps, schema_editor):
    PlayerOwnedGame = apps.get_model("players", "PlayerOwnedGame")
    PlayerAchievements = apps.get_model("players", "PlayerUnlockedAchievement")
    Achievements = apps.get_model("achievements", "Achievement")

    for owned_game in PlayerOwnedGame.objects.all():
        logger.info(f"Processing player owned game {owned_game.game_id} for {owned_game.player_id}")
        available_achievements = Achievements.objects.filter(game_id=owned_game.game_id)
        unlocked_achievements = PlayerAchievements.objects.filter(game_id=owned_game.game_id).order_by("-datetime")

        logger.info(
            f"Game has {available_achievements.count()} achievements, player has unlocked {unlocked_achievements.count()}"
        )
        if (
            available_achievements.count() > 0
            and unlocked_achievements.count() > 0
            and available_achievements.count() == unlocked_achievements.count()
        ):
            logger.info(f"Player has unlocked all achievements")
            owned_game.completed = unlocked_achievements[0].datetime
            owned_game.save()


class Migration(migrations.Migration):
    dependencies = [
        ("players", "0013_auto_20230925_2246"),
    ]

    operations = [
        migrations.RunPython(set_player_game_completed_properly, migrations.RunPython.noop),
    ]
