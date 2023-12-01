# Generated by Django 4.2.2 on 2023-11-03 22:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0007_alter_achievement_unique_together_and_more"),
        ("players", "0021_alter_playerownedgame_player"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playergameplaytime",
            name="game",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="player_playtime", to="games.game"
            ),
        ),
        migrations.AlterField(
            model_name="playergameplaytime",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="playtime", to="players.player"
            ),
        ),
        migrations.AlterField(
            model_name="playerownedgame",
            name="game",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="owners", to="games.game"
            ),
        ),
        migrations.AlterField(
            model_name="playerownedgame",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="games", to="players.player"
            ),
        ),
        migrations.AlterField(
            model_name="playerunlockedachievement",
            name="game",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="player_achievements", to="games.game"
            ),
        ),
        migrations.AlterField(
            model_name="playerunlockedachievement",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="achievements", to="players.player"
            ),
        ),
    ]
