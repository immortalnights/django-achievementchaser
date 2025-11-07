from typing import Optional
import graphene
from django.db.models import Q
from .types import PlayerType
from ..models import Player


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.BigInt(), name=graphene.String())
    players = graphene.List(PlayerType)

    def resolve_player(root, info, id: Optional[int] = None, name: Optional[str] = None) -> Optional[Player]:
        player = None
        result = Player.objects.filter(Q(id=id) | Q(name__iexact=name))
        if len(result) == 0:
            raise RuntimeError(f"Could not find Player with id '{id}' or name '{name}'")
        elif len(result) > 1:
            raise RuntimeError(f"Found too many matching players with id '{id}' or name '{name}'")
        else:
            player = result.first()

        return player

    def resolve_players(root, info) -> list[Player]:
        return list(Player.objects.all())
