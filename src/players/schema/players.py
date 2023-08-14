import logging
from typing import Optional, List
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from ..models import Player


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        fields = "__all__"

    # Override the model ID otherwise JavaScript rounds the number
    id = graphene.String()


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

    def resolve_players(root, info) -> List[Player]:
        return Player.objects.all()
