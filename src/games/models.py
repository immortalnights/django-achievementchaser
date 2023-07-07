from django.db import models
from achievements.models import Achievement


class Game(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    img_icon_url = models.CharField(max_length=255)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)

    @property
    def achievements(self):
        return Achievement.objects.filter(game=self)
