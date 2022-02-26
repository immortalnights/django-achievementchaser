from django.db import models
from players.models import Player
from achievements.models import Achievement


class Game(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    resynchronized = models.DateTimeField()
    name = models.CharField(max_length=255)
    img_icon_url = models.CharField(max_length=255)
    img_logo_url = models.CharField(max_length=255)
    resynchronization_required = models.BooleanField(default=False)


class GameAchievements(models.ManyToManyField):
    game = models.ForeignKey(Game)
    achievement = models.ForeignKey(Achievement)


class GameOwners(models.Model):
    game = models.ForeignKey(Game)
    player = models.ForeignKey(Player)
    added = models.DateTimeField()
    playtime_forever = models.PositiveIntegerField()
    playtime = models.JSONField()