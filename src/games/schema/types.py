import graphene
from graphene_django import DjangoObjectType
from ..models import Game, Achievement


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        exclude = ["default_value", "name", "updated", "added", "unlocked_by"]

    id = graphene.NonNull(graphene.ID)

    def resolve_id(root, info):
        return root.name

    def resolve_global_percentage(root, info):
        """Handle rare situations where the global achievement percentages for a game have not been fetched yet."""
        return root.global_percentage or 0


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        filter_fields = ["id", "name"]
        interfaces = (graphene.relay.Node,)
        exclude = [
            "updated",
            "resynchronized",
            "resynchronization_required",
            "added",
        ]

    id = graphene.NonNull(graphene.ID)
    achievement_count = graphene.Int()

    def resolve_achievements(root, info):
        return Achievement.objects.filter(game_id=root.id).order_by("-global_percentage")

    def resolve_achievement_count(root, info):
        return root.achievements.count()
