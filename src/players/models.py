from django.db import models
from games.models import Game
from achievements.models import Achievement


class Player(models.Model):
    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    profile_url = models.CharField(default="", max_length=255)
    avatar_small_url = models.CharField(default="", max_length=255)
    avatar_medium_url = models.CharField(default="", max_length=255)
    avatar_large_url = models.CharField(default="", max_length=255)
    created = models.IntegerField(default=0)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)
    games = models.ManyToManyField(Game, through="PlayerOwnedGame", related_name="player_games")
    played_games = models.ManyToManyField(Game, through="PlayerGamePlaytime", related_name="player_played_games")

    def __str__(self):
        return f"{self.name} ({self.id})"


class PlayerOwnedGame(models.Model):
    class Meta:
        unique_together = (("game", "player"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    playtime_forever = models.PositiveIntegerField()
    completion_percentage = models.FloatField(default=0)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    achievements_resynchronized = models.DateTimeField(null=True)
    achievements_resynchronization_required = models.BooleanField(default=True)


class PlayerGamePlaytime(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    playtime = models.PositiveIntegerField()
    datetime = models.DateTimeField(auto_now_add=True)


class PlayerUnlockedAchievement(models.Model):
    class Meta:
        unique_together = (("player", "game", "achievement"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    datetime = models.DateTimeField()


class Friend(models.Model):
    class Meta:
        unique_together = (("player", "friend"),)

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="player_to_player")
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friends")
