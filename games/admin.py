from django.contrib import admin
from .models import Game, GameAchievement

# Register your models here.
admin.site.register(Game)
admin.site.register(GameAchievement)