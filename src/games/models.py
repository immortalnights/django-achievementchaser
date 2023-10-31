from django.db import models


class Achievement(models.Model):
    class Meta:
        constraints = [models.UniqueConstraint(fields=["game", "name"], name="unique_game_achievement")]

        unique_together = (("name", "game"),)

    # Cannot use the "name" as the primary key because it is not globally unique.
    name = models.CharField(max_length=255)
    game = models.ForeignKey("games.Game", on_delete=models.CASCADE)
    default_value = models.IntegerField()
    display_name = models.CharField(max_length=255)
    hidden = models.BooleanField(default=False)
    description = models.TextField()
    icon_url = models.CharField(max_length=255)
    icon_gray_url = models.CharField(max_length=255)
    global_percentage = models.FloatField(default=0)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.display_name} ({self.name})"


class Game(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    img_icon_url = models.CharField(max_length=255)
    # average global percentage of all achievements (null if the game does not have achievements)
    difficulty_percentage = models.FloatField(null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.id})"

    def has_achievements(self):
        return Achievement.objects.filter(game_id=self.id).count() > 0
