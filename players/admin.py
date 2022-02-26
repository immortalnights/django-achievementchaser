from telnetlib import GA
from django.contrib import admin
from achievements.models import Achievement, AchievementAchievers
from games.models import Game, GameAchievements, GameOwners
from players.models import Friends, Player

# Register your models here.
admin.site.register(Achievement)
admin.site.register(AchievementAchievers)
admin.site.register(Game)
admin.site.register(GameAchievements)
admin.site.register(GameOwners)
admin.site.register(Friends)
admin.site.register(Player)
