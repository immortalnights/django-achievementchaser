# Generated by Django 4.0.2 on 2022-02-26 14:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Player",
            fields=[
                ("id", models.PositiveBigIntegerField(primary_key=True, serialize=False)),
                ("personaname", models.CharField(max_length=255)),
                ("added", models.DateTimeField()),
                ("updated", models.DateTimeField()),
                ("resynchronized", models.DateTimeField()),
                ("steam", models.TextField()),
                ("resynchronization_required", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Friends",
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
        ),
    ]