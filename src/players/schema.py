import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .tasks import resynchronize_player_task
from .models import Player
from .service import find_existing_player
from games.schema import GameType


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        fields = "__all__"
        filter_fields = [
            "id",
            "name",
        ]


class ProfileSummaryType(graphene.ObjectType):
    recent_games = graphene.List(GameType)
    # recent_achievements = graphene.List()
    perfect_games_count = graphene.Int()
    achievements_unlocked_count = graphene.Int()
    total_achievement_count = graphene.Int()
    # friends = graphene.List()
    total_game_count = graphene.Int()
    played_games_count = graphene.Int()
    total_playtime = graphene.Int()


class ProfileType(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    avatar_small_url = graphene.String()
    avatar_medium_url = graphene.String()
    avatar_large_url = graphene.String()
    profile_url = graphene.String()
    summary = graphene.Field(ProfileSummaryType)
    highest_completion_game = graphene.List(GameType)
    lowest_completion_game = graphene.List(GameType)
    easiest_games = graphene.List(GameType)
    # easiest_achievements = graphene.List()


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

    def resolve_profile(root, info, id=None):
        print(id)
        player = None
        try:
            player = Player.objects.get(id=id)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with id={id}")
            resp = None
        print(f"player={player}")
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
