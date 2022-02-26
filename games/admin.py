from django.contrib import admin
from .models import Game, GameAchievement, GameOwner

# Register your models here.
admin.site.register(Game)
admin.site.register(GameAchievement)
admin.site.register(GameOwner)