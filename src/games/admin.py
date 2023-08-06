from django.contrib import admin
from .models import Game
from achievements.models import Achievement


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
