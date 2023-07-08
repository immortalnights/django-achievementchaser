# Generated by Django 4.2.2 on 2023-07-08 23:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("achievements", "0001_initial"),
        ("games", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Player",
            fields=[
                ("id", models.PositiveBigIntegerField(primary_key=True, serialize=False)),
                ("personaname", models.CharField(max_length=255)),
                ("profile_url", models.CharField(default="", max_length=255)),
                ("avatar_small_url", models.CharField(default="", max_length=255)),
                ("avatar_medium_url", models.CharField(default="", max_length=255)),
                ("avatar_large_url", models.CharField(default="", max_length=255)),
                ("created", models.IntegerField(default=0)),
                ("added", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now_add=True)),
                ("resynchronized", models.DateTimeField(null=True)),
                ("resynchronization_required", models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name="GamePlaytime",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("datetime", models.DateTimeField(auto_now_add=True)),
                ("playtime", models.PositiveIntegerField()),
                ("game", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="games.game")),
                ("player", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="players.player")),
            ],
        ),
        migrations.CreateModel(
            name="OwnedGame",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("added", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                ("playtime_forever", models.PositiveIntegerField()),
                ("game", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="games.game")),
                ("player", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="players.player")),
            ],
            options={
                "unique_together": {("game", "player")},
            },
        ),
        migrations.CreateModel(
            name="Friend",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "friend",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="friends", to="players.player"
                    ),
                ),
                (
                    "player",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="player_to_player",
                        to="players.player",
                    ),
                ),
            ],
            options={
                "unique_together": {("player", "friend")},
            },
        ),
        migrations.CreateModel(
            name="AchievementAchieved",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "achievement",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="achievements.achievement"),
                ),
                ("player", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="players.player")),
            ],
            options={
                "unique_together": {("achievement", "player")},
            },
        ),
    ]
