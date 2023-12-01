# Generated by Django 4.2.2 on 2023-11-02 23:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("players", "0020_auto_20231031_2215"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playerownedgame",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="owned_games", to="players.player"
            ),
        ),
    ]
