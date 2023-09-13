from django.contrib import admin
from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """"""

    list_display = ("display_name", "game_name", "description", "percentage", "added", "updated")
    search_fields = ["display_name", "game__name"]

    @admin.display(description="Game")
    def game_name(self, obj):
        return obj.game.name

    @admin.display(description="Percentage")
    def percentage(self, obj):
        return f"{obj.global_percentage:05.2f}%" if obj.global_percentage is not None else "-"
