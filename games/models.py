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


class GameAchievement(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)


class GameOwner(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    added = models.DateTimeField(auto_now_add=True)
    playtime_forever = models.PositiveIntegerField()
    playtime = models.JSONField()