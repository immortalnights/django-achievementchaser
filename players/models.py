from django.db import models


class Player(models.Model):
    # Steam fields
    id = models.PositiveBigIntegerField(primary_key=True)
    personaname = models.CharField(max_length=255)
    profile_url = models.CharField(default="", max_length=255)
    avatar_small_url = models.CharField(default="", max_length=255)
    avatar_medium_url = models.CharField(default="", max_length=255)
    avatar_large_url = models.CharField(default="", max_length=255)
    created = models.IntegerField(default=0)
    # End steam
    added = models.DateTimeField(auto_now_add=True)
    # Why updated and resynchronized?
    updated = models.DateTimeField(auto_now_add=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)


class Friend(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="player_to_player")
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friends")