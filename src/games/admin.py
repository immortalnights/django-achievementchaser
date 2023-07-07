from django.contrib import admin
from .models import Game
from achievements.models import Achievement


class AchievementAdminInline(admin.StackedInline):
    model = Achievement


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    """"""

    list_display = ("name", "achievements", "resynchronized", "resynchronization_required")
    search_fields = ["name"]
    inlines = (AchievementAdminInline,)

    @admin.display(description="Achievements")
    def achievements(self, obj):
        return Achievement.objects.filter(game=obj).count()
