from django.contrib import admin
from .models import Game, GameAchievement


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """"""

    list_display = ("name", "resynchronized", "resynchronization_required")


# Register your models here.
admin.site.register(GameAchievement)
