from django.contrib import admin
from .models import Game, Achievement


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """"""

    list_display = ("name_with_id", "achievements", "resynchronized", "up_to_date", "added")
    search_fields = ["name"]

    def name_with_id(self, obj):
        return f"{obj.name} ({obj.id})"

    @admin.display(description="Up to Date")
    def up_to_date(self, obj):
        return not obj.resynchronization_required

    @admin.display(description="Achievements")
    def achievements(self, obj):
        return Achievement.objects.filter(game=obj).count()


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
