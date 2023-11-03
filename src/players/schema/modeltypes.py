import graphene
from graphene_django import DjangoObjectType
from ..models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement


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


class PlayerOwnedGameType(DjangoObjectType):
    class Meta:
        model = PlayerOwnedGame
        exclude = ["id", "added", "updated", "resynchronized", "resynchronization_required"]


class PlayerGamePlaytimeType(DjangoObjectType):
    class Meta:
        model = PlayerGamePlaytime
        exclude = ["id"]


class PlayerUnlockedAchievementType(DjangoObjectType):
    class Meta:
        model = PlayerUnlockedAchievement
        exclude = ["id"]
