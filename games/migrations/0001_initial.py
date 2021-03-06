# Generated by Django 4.0.2 on 2022-02-26 14:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('players', '0001_initial'),
        ('achievements', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('resynchronized', models.DateTimeField()),
                ('name', models.CharField(max_length=255)),
                ('img_icon_url', models.CharField(max_length=255)),
                ('img_logo_url', models.CharField(max_length=255)),
                ('resynchronization_required', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='GameOwners',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('added', models.DateTimeField()),
                ('playtime_forever', models.PositiveIntegerField()),
                ('playtime', models.JSONField()),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='games.game')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='players.player')),
            ],
        ),
        migrations.CreateModel(
            name='GameAchievements',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('achievement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='achievements.achievement')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='games.game')),
            ],
        ),
    ]
