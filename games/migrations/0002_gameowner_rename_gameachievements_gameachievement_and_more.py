# Generated by Django 4.0.2 on 2022-02-26 15:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('players', '0002_rename_friends_friend'),
        ('achievements', '0002_rename_achievementachievers_achievementachiever'),
        ('games', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameOwner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('added', models.DateTimeField()),
                ('playtime_forever', models.PositiveIntegerField()),
                ('playtime', models.JSONField()),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='games.game')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='players.player')),
            ],
        ),
        migrations.RenameModel(
            old_name='GameAchievements',
            new_name='GameAchievement',
        ),
        migrations.DeleteModel(
            name='GameOwners',
        ),
    ]
