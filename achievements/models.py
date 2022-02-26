from pydoc import describe
from django.db import models
from players.models import Player


class Achievement(models.Model):
    name = models.CharField(primary_key=True, max_length=255)
    default_value = models.IntegerField()
    display_name = models.CharField(max_length=255)
    hidden = models.BooleanField(default=False)
    description = models.TextField()
    icon_url = models.CharField(max_length=255)
    icon_gray_url = models.CharField(max_length=255)
    global_percentage = models.FloatField()


class AchievementAchiever(models.Model):
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)