
import graphene
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Game
from .types import GameType


class Query(graphene.ObjectType):
    game = graphene.Field(GameType, id=graphene.Int(), name=graphene.String())
    games = DjangoFilterConnectionField(GameType)

    def resolve_game(root, info, id: int | None = None, name: str | None = None):
        game = None
        result = Game.objects.filter(Q(id=id) | Q(name__iexact=name))
        if len(result) == 0:
            raise RuntimeError(f"Could not find Game with id '{id}' or name '{name}'")
        elif len(result) > 1:
            raise RuntimeError(f"Found too many matching games with id '{id}' or name '{name}'")
        else:
            game = result.first()

        return game
