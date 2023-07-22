import logging
import graphene
from django.forms.models import model_to_dict
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .tasks import resynchronize_player_task
from .models import Player, PlayerGamePlaytime, PlayerUnlockedAchievement
from .service import find_existing_player
from .queries import (
    get_player_recent_games,
    get_player_unlocked_achievements,
    get_player_games,
    get_player_achievements,
    get_player_total_playtime,
    get_player_friends,
)
from games.models import Game
from games.schema import GameType


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        fields = "__all__"
        filter_fields = [
            "id",
            "name",
        ]


class ProfileGameSummaryType(graphene.ObjectType):
    highest_completion_game = graphene.List(GameType)
    lowest_completion_game = graphene.List(GameType)
    easiest_games = graphene.List(GameType)
    # easiest_achievements = graphene.List()


class RecentGameType(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    # achievements = graphene.String()
    img_icon_url = graphene.String()
    playtime = graphene.Int()
    last_played = graphene.DateTime()


class UnlockedAchievementType(DjangoObjectType):
    class Meta:
        model = PlayerUnlockedAchievement
        fields = "__all__"
        filter_fields = ["id"]

    # name = graphene.String()
    # display_name = graphene.String()
    # game = graphene.Field(GameType)
    # description = graphene.String()
    # icon_url = graphene.String()
    # icon_gray_url = graphene.String()
    # unlocked = graphene.DateTime()


class ProfileSummaryType(graphene.ObjectType):
    recent_games = graphene.List(RecentGameType)
    recent_achievements = graphene.List(UnlockedAchievementType)
    perfect_games_count = graphene.Int()
    achievements_unlocked_count = graphene.Int()
    total_achievement_count = graphene.Int()
    # friends = graphene.List()
    total_games_count = graphene.Int()
    played_games_count = graphene.Int()
    total_playtime = graphene.Int()

    def resolve_recent_games(root, info):
        player_games = get_player_recent_games(Player(id=root.id), limit=5)

        def make_response(playtime: PlayerGamePlaytime):
            data = model_to_dict(playtime.game)
            data["playtime"] = playtime.playtime
            data["last_played"] = playtime.datetime
            return data

        return map(make_response, player_games)

    def resolve_recent_achievements(root, info):
        achievements = get_player_unlocked_achievements(Player(id=root.id), limit=5)
        return achievements

    def resolve_perfect_games_count(root, info):
        # games = get_player_games(Player(id=root.id), {"played_only": True})
        return None  # games.count()

    def resolve_achievements_unlocked_count(root, info):
        achievements = get_player_unlocked_achievements(Player(id=root.id))
        return achievements.count()

    def resolve_total_achievement_count(root, info):
        achievements = get_player_achievements(Player(id=root.id))
        return achievements.count()

    def resolve_friends(root, info):
        pass

    def resolve_total_games_count(root, info):
        games = get_player_games(Player(id=root.id))
        return games.count()

    def resolve_played_games_count(root, info):
        games = get_player_games(Player(id=root.id), {"played_only": True})
        return games.count()

    def resolve_total_playtime(root, info):
        # print("resolve_total_playtime", root)
        return get_player_total_playtime(Player(id=root.id))


class ProfileType(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    avatar_small_url = graphene.String()
    avatar_medium_url = graphene.String()
    avatar_large_url = graphene.String()
    profile_url = graphene.String()
    summary = graphene.Field(ProfileSummaryType, id=graphene.BigInt())
    game_summary = graphene.Field(ProfileGameSummaryType)

    def resolve_summary(player, info):
        # print("resolve_summary", player)

        profile = ProfileType()
        profile.id = player.id
        profile.name = player.name
        profile.avatar_small_url = player.avatar_small_url
        profile.avatar_medium_url = player.avatar_medium_url
        profile.avatar_large_url = player.avatar_large_url
        profile.profile_url = player.profile_url

        return profile


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.BigInt(), name=graphene.String())
    players = graphene.List(PlayerType)
    profile = graphene.Field(ProfileType, id=graphene.BigInt())

    def resolve_player(root, info, id=None, name=None):
        try:
            resp = Player.objects.get(id=id, name=name)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with ID={id} or name={name}")
            resp = None

        return resp

    def resolve_players(root, info):
        return Player.objects.all()

    def resolve_profile(root, info, id=None, **kwargs):
        player = None
        try:
            player = Player.objects.get(id=id)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with id={id}")

        return player


class ResynchronizePlayer(graphene.Mutation):
    class Arguments:
        identifier = graphene.String()

    ok = graphene.Boolean()
    id = graphene.String()
    name = graphene.String()
    error = graphene.String()
    resynchronized = graphene.String()

    @staticmethod
    def mutate(root, info, identifier):
        try:
            logging.info("Scheduling resynchronize_player_task")
            # FIXME it would be good if this was dynamic...
            task = resynchronize_player_task.delay(identifier)
            result = task.get(timeout=10)

            response = {"ok": result}
            if result is True:
                player = find_existing_player(identifier)
                response["id"] = str(player.id)
                response["name"] = player.name
                response["resynchronized"] = player.resynchronized

        except Player.DoesNotExist as ex:
            response = {"ok": False, "error": ex.args[0]}

        logging.info(response)
        return ResynchronizePlayer(**response)


class Mutation(graphene.ObjectType):
    # create_player = CreatePlayer.Field()
    resynchronize_player = ResynchronizePlayer.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
