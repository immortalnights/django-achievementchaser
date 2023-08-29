import logging
from dataclasses import dataclass
from typing import Optional, List, TypedDict
from django.db.models import Q, Sum, Max, Subquery, OuterRef, CharField
from .models import Player, PlayerGamePlaytime, PlayerOwnedGame, PlayerUnlockedAchievement
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


def get_player_recent_games(player: Player, limit: Optional[int] = None) -> List[PlayerOwnedGame]:
    q = PlayerGamePlaytime.objects.filter(player=player).order_by("-datetime")

    # distinct doesn't work well here as it cannot order by "datetime" without distinct representing the the pair of
    # game_id and datetime, which would still provide duplicate games. Therefore, iterate the results until there
    # are `limit` items.
    # If `limit` is None, return the complete results, with duplicates.

    results = None
    if limit is None:
        results = q
    else:
        unique_games = {}
        results = []
        for item in q:
            if item.game.id not in unique_games:
                results.append(item)
                unique_games[item.game.id] = True

            if len(results) == limit:
                break

    return results


def get_player_unlocked_achievements(player: Player, limit: Optional[int] = None) -> List[PlayerUnlockedAchievement]:
    res = (
        PlayerUnlockedAchievement.objects.select_related("game", "achievement")
        .filter(player=player)
        .order_by("-datetime")
    )

    if limit:
        res = res[:limit]

    return res


def get_player_achievements(player: Player, limit: Optional[int] = None) -> List[PlayerOwnedGame]:
    owned_games = PlayerOwnedGame.objects.filter(player=player)
    res = Achievement.objects.filter(game__in=owned_games.values("game"))

    if limit:
        res = res[:limit]

    return res


def get_player_friends(player: Player):
    pass


def get_player_games(player: Player, options: Optional[PlayerGameOptions] = None, limit: Optional[int] = None):
    """Player games"""
    q = Q(player=player)

    if options:
        if "played_only" in options and options["played_only"]:
            q &= Q(playtime_forever__gt=0)

        if "perfect_only" in options and options["perfect_only"]:
            q &= Q(completion_percentage=1)

    if limit is not None:
        q = q[:limit]

    return PlayerOwnedGame.objects.filter(q)


def get_player_total_playtime(player: Player) -> int:
    """Total playtime"""
    res = get_player_games(player, {"played_only": True}).aggregate(Sum("playtime_forever"))
    return res["playtime_forever__sum"]
