from django.db.models import Sum
import graphene
from graphene.relay import Node
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


class PlayerUnlockedAchievementNode(DjangoObjectType):
    class Meta:
        model = PlayerUnlockedAchievement
        interfaces = (Node,)
        filter_fields: list[str] = []
        exclude: list[str] = []


class PlayerOwnedGameNode(DjangoObjectType):
    class Meta:
        model = PlayerOwnedGame
        interfaces = (Node,)
        filter_fields: list[str] = []
        exclude = ["added", "updated", "resynchronized", "resynchronization_required"]

    unlocked_achievements = graphene.List(PlayerUnlockedAchievementNode)
    unlocked_achievement_count = graphene.Int()

    def resolve_unlocked_achievements(root, info):
        return PlayerUnlockedAchievement.objects.filter(player=root.player_id, game=root.game_id).order_by("-datetime")

    def resolve_unlocked_achievement_count(root, info):
        return PlayerUnlockedAchievement.objects.filter(player=root.player_id, game=root.game_id).count()


class PlayerGamePlaytimeNode(DjangoObjectType):
    class Meta:
        model = PlayerGamePlaytime
        interfaces = (Node,)
        fields = "__all__"


class ProfileType(graphene.ObjectType):
    player: "Player"
    total_playtime = graphene.Int()

    owned_games = graphene.Int()
    played_games = graphene.Int()
    perfect_games = graphene.Int()

    unlocked_achievements = graphene.Int()
    locked_achievements = graphene.Int()

    def resolve_total_playtime(root, info):
        res = root.player.games.aggregate(Sum("playtime_forever"))
        return res["playtime_forever__sum"]

    def resolve_owned_games(root, info):
        return root.player.games.count()

    def resolve_played_games(root, info):
        return root.player.games.filter(playtime_forever__gt=0).count()

    def resolve_perfect_games(root, info):
        return root.player.games.filter(completion_percentage=1).count()

    def resolve_unlocked_achievements(root, info):
        return root.player.unlocked_achievements.count()

    def resolve_locked_achievements(root, info):
        return root.player.available_achievements.count()


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

    profile = graphene.Field(ProfileType)

    game = graphene.Field(PlayerOwnedGameNode, game=graphene.String())

    games = DjangoFilterConnectionField(
        PlayerOwnedGameNode,
        filterset_class=PlayerOwnedGameFilter,
    )

    unlocked_achievements = DjangoFilterConnectionField(
        PlayerUnlockedAchievementNode,
        filterset_class=PlayerUnlockedAchievementFilter,
    )

    available_achievements = DjangoFilterConnectionField(
        AchievementNode, filterset_class=PlayerAvailableAchievementFilter
    )

    def resolve_profile(root, info):
        profile = ProfileType()
        profile.player = root
        return profile

    def resolve_game(root, info, game):
        return PlayerOwnedGame.objects.filter(player_id=root.id, game_id=game).first()
