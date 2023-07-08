from django.contrib import admin
from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """"""

    list_display = ("display_name", "game_name", "description", "added", "updated")

    @admin.display(description="Game")
    def game_name(self, obj):
        return obj.game.name
