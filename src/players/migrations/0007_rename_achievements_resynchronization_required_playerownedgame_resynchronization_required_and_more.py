# Generated by Django 4.2.2 on 2023-08-01 23:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("players", "0006_alter_playerownedgame_completion_percentage"),
    ]

    operations = [
        migrations.RenameField(
            model_name="playerownedgame",
            old_name="achievements_resynchronization_required",
            new_name="resynchronization_required",
        ),
        migrations.RenameField(
            model_name="playerownedgame",
            old_name="achievements_resynchronized",
            new_name="resynchronized",
        ),
        migrations.AddField(
            model_name="player",
            name="friends",
            field=models.ManyToManyField(related_name="player_friends", through="players.Friend", to="players.player"),
        ),
        migrations.AddField(
            model_name="player",
            name="unlocked_achievements",
            field=models.ManyToManyField(
                related_name="player_unlocked_achievements",
                through="players.PlayerUnlockedAchievement",
                to="games.achievement",
            ),
        ),
        migrations.AlterField(
            model_name="friend",
            name="friend",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="friend_to_player", to="players.player"
            ),
        ),
        migrations.AlterField(
            model_name="friend",
            name="player",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="player_to_friend", to="players.player"
            ),
        ),
    ]
