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
class PlayerOwnedGameAdmin(admin.ModelAdmin):
    """"""

    list_display = (
        "edit",
        "game",
        "player",
        "playtime_forever",
        "achievements_resynchronized",
        "achievements_up_to_date",
        "added",
        "updated",
    )
    search_fields = ["game__name"]

    @admin.display(description="Edit")
    def edit(self, obj):
        return "Edit"

    @admin.display(description="Up to Date")
    def achievements_up_to_date(self, obj):
        return not obj.achievements_resynchronization_required


@admin.register(PlayerGamePlaytime)
class PlayerGamePlaytimeAdmin(admin.ModelAdmin):
    """"""

    list_display = ("edit", "game", "player", "playtime", "datetime")
    search_fields = ["game__name"]

    @admin.display(description="Edit")
    def edit(self, obj):
        return "Edit"


admin.site.register(Friend)


@admin.register(PlayerUnlockedAchievement)
class PlayerUnlockedAchievementAdmin(admin.ModelAdmin):
    """"""

    list_display = ("edit", "achievement", "game", "player", "datetime")
    # search_fields = ["game__name"]

    @admin.display(description="Edit")
    def edit(self, obj):
        return "Edit"

    # @admin.display()
    # def game(self, obj):
    #     Achievement.objects.filter(obj.achievement)
