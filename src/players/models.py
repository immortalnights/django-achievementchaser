from django.db import models
from games.models import Game, Achievement


class Player(models.Model):
    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    api_key = models.CharField(default="", max_length=32)
    profile_url = models.CharField(default="", max_length=255)
    avatar_small_url = models.CharField(default="", max_length=255)
    avatar_medium_url = models.CharField(default="", max_length=255)
    avatar_large_url = models.CharField(default="", max_length=255)
    created = models.IntegerField(default=0)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.id})"


class PlayerOwnedGame(models.Model):
    class Meta:
        constraints = [models.UniqueConstraint(fields=["player", "game"], name="unique_player_game")]

    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    playtime_forever = models.PositiveIntegerField()
    completion_percentage = models.FloatField(default=0)
    completed = models.DateTimeField(null=True)
    last_played = models.DateTimeField(null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    # Player game achievements resynchronized
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)


class PlayerGamePlaytime(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    playtime = models.PositiveIntegerField()
    datetime = models.DateTimeField(auto_now_add=True)


class PlayerUnlockedAchievement(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["player", "game", "achievement"], name="unique_player_achievement")
        ]

    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    datetime = models.DateTimeField()


class Friend(models.Model):
    class Meta:
        constraints = [models.UniqueConstraint(fields=["player", "friend"], name="unique_player_friend")]

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="player_to_friend")
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friend_to_player")
