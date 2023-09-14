from django.db import models


class Achievement(models.Model):
    class Meta:
        unique_together = (("name", "game"),)

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
