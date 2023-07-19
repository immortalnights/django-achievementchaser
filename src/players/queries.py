import logging
from django.db.models import Sum
from .models import Player, PlayerOwnedGame
from games.models import Game
from achievements.models import Achievement


def get_recent_games(player: Player):
    pass


def get_recent_achievements(player: Player):
    pass


def get_perfect_games(player: Player):
    pass


def get_achievements_unlocked(player: Player):
    pass


def get_total_achievements(player: Player):
    pass


def get_friends(player: Player):
    pass


def get_player_games(player: Player, limit: int):
    pass


def get_played_games(player: Player, limit: int):
    """Player games ordered by last played"""
    pass


def get_total_playtime(player: Player):
    """Total playtime"""
    res = PlayerOwnedGame.objects.filter(player=player).aggregate(Sum("playtime_forever"))
    return res["playtime_forever__sum"]
