from django.db import models


class Player(models.Model):
    id = models.PositiveBigIntegerField(primary_key=True)
    personaname = models.CharField(max_length=255)
    added = models.DateTimeField()
    # Why updated and resynchronized?
    updated = models.DateTimeField()
    resynchronized = models.DateTimeField()
    # Why raw Steam data?
    steam = models.TextField()
    resynchronization_required = models.BooleanField(default=False)


class Friends(models.ManyToManyField):
    player = models.ForeignKey(Player)
    friend = models.ForeignKey(Player)