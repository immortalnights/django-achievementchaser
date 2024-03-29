# Generated by Django 4.2.2 on 2023-10-25 19:54

from django.db import migrations
from loguru import logger


def fix_last_played_time(apps, schema_editor):
    PlayerOwnedGame = apps.get_model("players", "PlayerOwnedGame")

    owned_games = PlayerOwnedGame.objects.filter(last_played="1970-01-01T00:00:00.000Z")
    logger.info(f"Found {owned_games.count()} owned games with invalid playtime")

    saved = 0
    for owned_game in owned_games:
        try:
            owned_game.last_played = None
            owned_game.save()
            saved += 1
        except Exception as e:
            logger.error(f"Failed to set last_played for game {owned_game.game_id} owned by {owned_game.player_id}")

    logger.info(f"Updated last_played for {saved} games")


class Migration(migrations.Migration):
    dependencies = [
        ("players", "0016_auto_20231019_2221"),
    ]

    operations = [
        migrations.RunPython(fix_last_played_time, migrations.RunPython.noop),
    ]
