import logging
from dataclasses import dataclass
from typing import Optional, TypedDict
from django.db.models import Q, Sum, Max, Subquery, OuterRef, CharField
from .models import Player, PlayerGamePlaytime, PlayerOwnedGame
from games.models import Game
from achievements.models import Achievement


PlayerGameOptions = TypedDict(
    "PlayerGameOptions",
    {
        "played_only": bool,
        "perfect_only": bool,
    },
    total=False,
)


PlayerAchievementOptions = TypedDict(
    "PlayerAchievementOptions",
    {
        "unlocked_only": bool,
    },
    total=False,
)


def get_player_recent_games(player: Player, limit: Optional[int] = None):
    played_games = (
        PlayerGamePlaytime.objects.select_related("game")
        .filter(player=player)
        .distinct("game")
        .order_by("game", "-datetime")
    )

    q = played_games
    q = PlayerGamePlaytime.objects.filter(pk__in=played_games.values("pk")).order_by("-datetime")

    if limit:
        q = q[:limit]

    return q


def get_player_recent_achievements(player: Player):
    pass


def get_player_achievements(
    player: Player, options: Optional[PlayerAchievementOptions] = None, limit: Optional[int] = None
):
    q = Q(player=player)

    if options:
        if options["unlocked_only"]:
            q.AND()

    if limit is not None:
        q = q[:limit]

    return PlayerOwnedGame.objects.filter(q)


def get_player_friends(player: Player):
    pass


def get_player_games(player: Player, options: Optional[PlayerGameOptions] = None, limit: Optional[int] = None):
    """Player games"""
    q = Q(player=player)

    if options:
        if options["played_only"]:
            q &= Q(playtime_forever__gt=0)

        # if options["perfect_only"]:

    if limit is not None:
        q = q[:limit]

    return PlayerOwnedGame.objects.filter(q)


def get_player_total_playtime(player: Player):
    """Total playtime"""
    res = get_player_games(player, {"played_only": True}).aggregate(Sum("playtime_forever"))
    return res["playtime_forever__sum"]
