from django.contrib import admin
from .models import Player, PlayerGamePlaytime, PlayerOwnedGame, PlayerUnlockedAchievement, Friend


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    """"""

    list_display = (
        "name",
        "profile_url",
        "games",
        "added",
        "resynchronized",
        "resynchronization_required",
        "added",
        "updated",
    )

    @admin.display(description="Games")
    def games(self, obj):
        return PlayerOwnedGame.objects.filter(player=obj).count()


@admin.register(PlayerOwnedGame)
class OwnedGameAdmin(admin.ModelAdmin):
    """"""

    list_display = ("edit", "game", "player", "added", "playtime_forever")
    search_fields = ["game__name"]

    @admin.display(description="Edit")
    def edit(self, obj):
        return "Edit"


@admin.register(PlayerGamePlaytime)
class GamePlaytimeAdmin(admin.ModelAdmin):
    """"""

    list_display = ("edit", "game", "player", "playtime", "datetime")
    search_fields = ["game__name"]

    @admin.display(description="Edit")
    def edit(self, obj):
        return "Edit"


admin.site.register(Friend)
admin.site.register(PlayerUnlockedAchievement)
