import graphene
from django.db.models import Sum
from graphene_django import DjangoObjectType
from ..models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement,
from ..queries import get_player_games2
from games.models import Achievement
from games.schema.types import GameType


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        # fields = "__all__"
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


class PlayerOwnedGameListType(graphene.Connection):
    class Meta:
        node = PlayerOwnedGameType

    total_count = graphene.Int()


class PlayerGamePlaytime(DjangoObjectType):
    class Meta:
        model = PlayerGamePlaytime
        exclude = ["id"]


class PlayerUnlockedAchievementType(DjangoObjectType):
    class Meta:
        model = PlayerUnlockedAchievement
        exclude = ["id"]


class PlayerUnlockedAchievementListType(graphene.Connection):
    class Meta:
        node = PlayerUnlockedAchievementType

    total_count = graphene.Int()


class PlayerProfileType(graphene.ObjectType):
    id = graphene.String()
    total_playtime = graphene.Int()

    owned_games = graphene.Int()
    played_games = graphene.Int()
    perfect_games = graphene.Int()

    unlocked_achievements = graphene.Int()
    locked_achievements = graphene.Int()

    def resolve_total_playtime(root, info):
        res = get_player_games2(player=root.id, played=True).aggregate(Sum("playtime_forever"))
        return res["playtime_forever__sum"]

    def resolve_owned_games(root, info):
        return get_player_games2(player=root.id).count()

    def resolve_played_games(root, info):
        return get_player_games2(player=root.id, played=True).count()

    def resolve_perfect_games(root, info):
        return get_player_games2(player=root.id, perfect=True).count()

    def resolve_unlocked_achievements(root, info):
        return PlayerUnlockedAchievement.objects.filter(player_id=root.id).count()

    def resolve_locked_achievements(root, info):
        owned_games = PlayerOwnedGame.objects.filter(player_id=root.id)
        return Achievement.objects.filter(game__in=owned_games.values("game")).count()
