from telnetlib import GA
from django.contrib import admin
from .models import Player, GamePlaytime, OwnedGame, AchievementAchieved, Friend

# Register your models here.
admin.site.register(Player)
admin.site.register(GamePlaytime)
admin.site.register(OwnedGame)
admin.site.register(Friend)
