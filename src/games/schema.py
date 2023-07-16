import logging
import graphene
from graphene_django import DjangoObjectType
from .models import Game


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = "__all__"
        filter_fields = ["id", "name", "imgIconUrl", "achievements"]


class Query(graphene.ObjectType):
    game = graphene.Field(GameType, id=graphene.Int())
    games = graphene.List(GameType)

    def resolve_game(root, info, id: int):
        try:
            resp = Game.objects.get(id=id)
            resp.achievements
        except Game.DoesNotExist:
            logging.warning(f"Could not find Game with id={id}")
            resp = None

        return resp

    def resolve_games(root, info, **kwargs):
        return Game.objects.all()
