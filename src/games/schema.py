import logging
import graphene
from graphene_django import DjangoObjectType
from .models import Game
from achievements.schema import AchievementType


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        # fields = "__all__"
        fields = ["id", "name", "img_icon_url"]
        # filter_fields = ["id", "name", "imgIconUrl", "achievements"]

    achievements = graphene.List(AchievementType)

    def resolve_achievements(self: Game, info, **kwargs):
        return self.achievements


class Query(graphene.ObjectType):
    game = graphene.Field(GameType, id=graphene.Int(required=True))
    games = graphene.List(GameType)

    def resolve_game(root, info, id: int):
        game = None
        try:
            game = Game.objects.get(id=id)
        except Game.DoesNotExist:
            logging.warning(f"Could not find Game with id={id}")

        return game

    def resolve_games(root, info, **kwargs):
        return Game.objects.all()


schema = graphene.Schema(query=Query)
