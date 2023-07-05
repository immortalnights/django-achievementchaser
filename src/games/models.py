from django.db import models
from achievements.models import Achievement


class Game(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    resynchronized = models.DateTimeField(null=True)
    name = models.CharField(max_length=255)
    img_icon_url = models.CharField(max_length=255)
    resynchronization_required = models.BooleanField(default=True)


class GameAchievement(models.Model):
    class Meta:
        unique_together = (("game", "achievement"),)

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
