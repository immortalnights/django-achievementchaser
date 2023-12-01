# Generated by Django 4.2.2 on 2023-11-02 23:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0006_achievement_unique_game_achievement"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="achievement",
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name="achievement",
            name="game",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="achievements", to="games.game"
            ),
        ),
    ]
