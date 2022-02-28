import graphene
from graphene_django import DjangoObjectType
from .models import Game, GameAchievement


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = "__all__"


class Query(graphene.ObjectType):
    games = graphene.List(GameType)

    def resolve_games(root, info, **kwargs):
        # Querying a list
        return Game.objects.all()


# schema = graphene.Schema(query=Query)