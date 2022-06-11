from telnetlib import GA
from django.contrib import admin
from .models import Player, GamePlaytime, OwnedGame, AchievementAchieved, Friend

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    """"""
    list_display = ("personaname", "profile_url", "added", "resynchronized", "resynchronization_required")


@admin.register(OwnedGame)
class OwnedGameAdmin(admin.ModelAdmin):
    """"""
    list_display = ("game_name", "player_name", "added", "playtime_forever")

    @admin.display(description="Game")
    def game_name(self, obj):
        return obj.game.name

    @admin.display(description="Player")
    def player_name(self, obj):
        return obj.player.personaname

# Register your models here.
admin.site.register(GamePlaytime)
admin.site.register(Friend)
