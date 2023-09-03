import graphene
from graphene_django import DjangoObjectType
from .models import Achievement


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        fields = "__all__"


class Query(graphene.ObjectType):
    pass
    # game_achievements = graphene.List(AchievementType, id=graphene.Int(required=True))

    # def resolve_game_achievements(root, info, id: int, **kwargs):
    #     game = Game.objects.get(id=id)
    #     return game.achievements
