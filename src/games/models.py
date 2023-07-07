from django.db import models


class Game(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    img_icon_url = models.CharField(max_length=255)
    resynchronized = models.DateTimeField(null=True)
    resynchronization_required = models.BooleanField(default=True)
