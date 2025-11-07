from django.db.models import Sum
import graphene
from graphene.relay import Node
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from ..models import Player, PlayerOwnedGame, PlayerGamePlaytime, PlayerUnlockedAchievement
from .filters import PlayerOwnedGameFilterSet, PlayerUnlockedAchievementFilterSet, PlayerAvailableAchievementFilterSet
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

    unlocked_achievement_count = graphene.Int()

    def resolve_unlocked_achievement_count(root, info):
        return PlayerUnlockedAchievement.objects.filter(player=root.player_id, game=root.game_id).count()


class PlayerGamePlaytimeNode(DjangoObjectType):
    class Meta:
        model = PlayerGamePlaytime
        interfaces = (Node,)
        fields = "__all__"


class ProfileType(graphene.ObjectType):
    player: "PlayerType"
    total_playtime = graphene.Int()

    owned_games = graphene.Int()
    played_games = graphene.Int()
    perfect_games = graphene.Int()

    unlocked_achievements = graphene.Int()
    locked_achievements = graphene.Int()

    played_games_for_year = graphene.Int(year=graphene.Int(required=True))
    perfect_games_for_year = graphene.Int(year=graphene.Int(required=True))
    unlocked_achievement_for_year = graphene.Int(year=graphene.Int(required=True))

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

    def resolve_played_games_for_year(root, info, year: int):
        return root.player.games.filter(last_played__year=year, playtime_forever__gt=0).count()

    def resolve_perfect_games_for_year(root, info, year: int):
        return root.player.games.filter(completion_percentage=1, completed__year=year).count()

    def resolve_unlocked_achievement_for_year(root, info, year: int):
        return root.player.unlocked_achievements.filter(datetime__year=year).count()


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

    game = graphene.Field(PlayerOwnedGameNode, game=graphene.Int())

    games = DjangoFilterConnectionField(
        PlayerOwnedGameNode,
        filterset_class=PlayerOwnedGameFilterSet,
    )

    unlocked_achievements = DjangoFilterConnectionField(
        PlayerUnlockedAchievementNode,
        filterset_class=PlayerUnlockedAchievementFilterSet,
    )

    available_achievements = DjangoFilterConnectionField(
        AchievementNode, locked=graphene.Boolean(), filterset_class=PlayerAvailableAchievementFilterSet
    )

    def resolve_profile(root, info):
        profile = ProfileType()
        profile.player = root
        return profile

    def resolve_game(root, info, game):
        return PlayerOwnedGame.objects.filter(player_id=root.id, game_id=game).first()

    def resolve_available_achievements(root, info, locked: bool = False, **kwargs):
        owned_games = PlayerOwnedGame.objects.filter(player_id=root.id)
        available_achievements = Achievement.objects.filter(game__in=owned_games.values("game"))

        if locked is True:
            unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player_id=root.id)

            available_achievements = available_achievements.exclude(
                id__in=unlocked_achievements.values("achievement__id")
            )

        return available_achievements
