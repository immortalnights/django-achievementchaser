import graphene
from graphene_django import DjangoObjectType
from ..models import Game, Achievement


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        exclude = [
            "updated",
            "resynchronized",
            "resynchronization_required",
            "added",
        ]

    id = graphene.NonNull(graphene.String)
    achievement_count = graphene.Int()

    def resolve_achievement_count(root, info):
        return root.achievement_set.count()


class GameListType(graphene.Connection):
    class Meta:
        node = GameType

    total_count = graphene.Int()


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        exclude = ["default_value", "name", "updated", "added"]

    def resolve_id(root, info):
        return root.name

    def resolve_global_percentage(root, info):
        """Handle rare situations where the global achievement percentages for a game have not been fetched yet."""
        return root.global_percentage or 0


class GameAchievementListType(graphene.Connection):
    class Meta:
        node = AchievementType

    total_count = graphene.Int()
