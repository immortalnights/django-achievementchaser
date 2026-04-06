from typing import Optional, TypedDict

from django.db.models import Q, Sum

from games.models import Achievement

from .models import Player, PlayerOwnedGame

PlayerGameOptions = TypedDict(
    "PlayerGameOptions",
    {
        "played_only": bool,
        "perfect_only": bool,
    },
    total=False,
)


def get_player_achievements(player: Player, limit: Optional[int] = None) -> list[Achievement]:
    owned_games = PlayerOwnedGame.objects.filter(player=player)
    res = list(Achievement.objects.filter(game__in=owned_games.values("game")))

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
