from typing import ClassVar

import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from players.schema.types import PlayerOwnedGameNode, PlayerUnlockedAchievementNode

from ..models import Achievement, Game
from .filters import PlayerOwnedGameFilter, PlayerUnlockedAchievementFilter


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        exclude: ClassVar[list[str]] = ["default_value", "name", "updated", "added", "unlocked_by"]

    id = graphene.NonNull(graphene.ID)

    def resolve_id(root, info):
        return root.name

    def resolve_global_percentage(root, info):
        """Handle rare situations where the global achievement percentages for a game have not been fetched yet."""
        return root.global_percentage or 0


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        filter_fields: ClassVar[list[str]] = ["id", "name"]
        interfaces = (graphene.relay.Node,)
        exclude: ClassVar[list[str]] = [
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

    player_achievements = DjangoFilterConnectionField(
        PlayerUnlockedAchievementNode,
        filterset_class=PlayerUnlockedAchievementFilter,
    )

    owners = DjangoFilterConnectionField(PlayerOwnedGameNode, filterset_class=PlayerOwnedGameFilter)
