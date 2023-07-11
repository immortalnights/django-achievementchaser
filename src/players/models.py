from django.db import models
from games.models import Game
from achievements.models import Achievement


class Player(models.Model):
    # Steam fields
    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    profile_url = models.CharField(default="", max_length=255)
    avatar_small_url = models.CharField(default="", max_length=255)
    avatar_medium_url = models.CharField(default="", max_length=255)
    avatar_large_url = models.CharField(default="", max_length=255)
    created = models.IntegerField(default=0)
    # End steam
    added = models.DateTimeField(auto_now_add=True)
    # Why updated and resynchronized?
    updated = models.DateTimeField(auto_now=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.id})"


class PlayerOwnedGame(models.Model):
    class Meta:
        unique_together = (("game", "player"),)

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    playtime_forever = models.PositiveIntegerField()


class PlayerGamePlaytime(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)
    playtime = models.PositiveIntegerField()


class PlayerUnlockedAchievement(models.Model):
    class Meta:
        unique_together = (("player", "achievement"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)


class Friend(models.Model):
    class Meta:
        unique_together = (("player", "friend"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="player_to_player")
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friends")
