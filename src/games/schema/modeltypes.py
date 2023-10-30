import graphene
from graphene_django import DjangoObjectType
from ..models import Game, Achievement


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = "__all__"

    id = graphene.NonNull(graphene.String)
    achievement_count = graphene.Int()

    def resolve_achievement_count(root, info):
        return root.achievement_set.count()


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        fields = "__all__"

    def resolve_global_percentage(root, info):
        """Handle rare situations where the global achievement percentages for a game have not been fetched yet."""
        return root.global_percentage or 0
