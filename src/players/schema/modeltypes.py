import graphene
from graphene.relay import Node, Connection, ConnectionField
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from ..models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement
from .filters import PlayerOwnedGameFilter, PlayerUnlockedAchievementFilter, PlayerAvailableAchievementFilter
from games.models import Achievement


class AchievementNode(DjangoObjectType):
    class Meta:
        model = Achievement
        interfaces = (Node,)
        filter_fields: list[str] = []
        exclude = ["default_value", "name", "updated", "added", "unlocked_by"]

    id = graphene.NonNull(graphene.ID)

    def resolve_id(root, info):
        return root.name


class PlayerOwnedGameNode(DjangoObjectType):
    class Meta:
        model = PlayerOwnedGame
        interfaces = (Node,)
        filter_fields: list[str] = []
        exclude = ["added", "updated", "resynchronized", "resynchronization_required"]


class PlayerGamePlaytimeNode(DjangoObjectType):
    class Meta:
        model = PlayerGamePlaytime
        interfaces = (Node,)
        fields = "__all__"


class PlayerUnlockedAchievementNode(DjangoObjectType):
    class Meta:
        model = PlayerUnlockedAchievement
        interfaces = (Node,)
        filter_fields: list[str] = []
        exclude: list[str] = []


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        exclude = [
            "updated",
            "resynchronized",
            "api_key",
            "resynchronization_required",
            "added",
            "created",
        ]

    # Override the model ID otherwise JavaScript rounds the number
    id = graphene.NonNull(graphene.String)

    games = DjangoFilterConnectionField(
        PlayerOwnedGameNode,
        filterset_class=PlayerOwnedGameFilter,
    )

    # unlocked_achievements = ConnectionField(PlayerUnlockedAchievementConnection, year=graphene.Int())
    unlocked_achievements = DjangoFilterConnectionField(
        PlayerUnlockedAchievementNode,
        filterset_class=PlayerUnlockedAchievementFilter,
    )

    available_achievements = DjangoFilterConnectionField(
        AchievementNode, filterset_class=PlayerAvailableAchievementFilter
    )

    def resolve_available_achievements(root, info, game=None, **kwargs):
        owned_games = PlayerOwnedGame.objects.filter(player_id=root.id)
        unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player_id=root.id)
        available_achievements = Achievement.objects.filter(game__in=owned_games.values("game"))

        # Filter unlocked achievements
        available_achievements = available_achievements.exclude(id__in=unlocked_achievements.values("achievement__id"))

        return available_achievements
