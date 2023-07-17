import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .tasks import resynchronize_player_task
from .models import Player
from .service import find_existing_player


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        fields = "__all__"
        filter_fields = [
            "id",
            "name",
        ]


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.Int(), name=graphene.String())
    players = graphene.List(PlayerType)

    def resolve_player(root, info, id=None, name=None):
        try:
            resp = Player.objects.get(id=id, name=name)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with ID={id} or name={name}")
            resp = None

        return resp

    def resolve_players(root, info, **kwargs):
        return Player.objects.all()


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
