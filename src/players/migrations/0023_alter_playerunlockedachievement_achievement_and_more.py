# Generated by Django 4.2.2 on 2023-11-04 20:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0007_alter_achievement_unique_together_and_more"),
        ("players", "0022_alter_playergameplaytime_game_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playerunlockedachievement",
            name="achievement",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="unlocked_by", to="games.achievement"
            ),
        ),
        migrations.AlterField(
            model_name="playerunlockedachievement",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="unlocked_achievements", to="players.player"
            ),
        ),
    ]
