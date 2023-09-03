import graphene
from graphene_django import DjangoObjectType
from typing import Optional, List
from django.db.models import Q
from ..models import Game


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = "__all__"


class Query(graphene.ObjectType):
    game = graphene.Field(GameType, id=graphene.Int(), name=graphene.String())
    games = graphene.List(GameType)

    def resolve_game(root, info, id: Optional[int] = None, name: Optional[str] = None) -> Optional[Game]:
        game = None
        result = Game.objects.filter(Q(id=id) | Q(name__iexact=name))
        if len(result) == 0:
            raise RuntimeError(f"Could not find Game with id '{id}' or name '{name}'")
        elif len(result) > 1:
            raise RuntimeError(f"Found too many matching games with id '{id}' or name '{name}'")
        else:
            game = result.first()

        return game

    def resolve_games(root, info, **kwargs) -> List[Game]:
        return Game.objects.all()
