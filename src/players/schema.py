import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .tasks import resynchronize_player_task
from .models import Player


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        interfaces = (graphene.Node,)
        fields = "__all__"
        filter_fields = [
            "id",
            "personaname",
        ]


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.Int(), name=graphene.String())
    players = DjangoFilterConnectionField(PlayerType)

    def resolve_player(root, info, id=None, name=None):
        try:
            resp = Player.objects.get(id=id, personaname=name)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with ID={id} or name={name}")
            resp = None

        return resp


class CreatePlayer(graphene.Mutation):
    class Arguments:
        identity = graphene.String()

    ok = graphene.Boolean(False)
    player = graphene.String()  # graphene.Field(lambda: Player)

    # @staticmethod
    def mutate(root, info, identity):
        instance = Player.create_player(identity)
        player_id = instance.id if instance else None
        return CreatePlayer(player=player_id, ok=instance is not None)


class ResynchronizePlayer(graphene.Mutation):
    class Arguments:
        identifier = graphene.String()

    ok = graphene.Boolean()
    id = graphene.String()
    personaname = graphene.String()
    resynchronized = graphene.String()

    @staticmethod
    def mutate(root, info, identifier):
        logging.info("Scheduling resynchronize_player_task")
        task = resynchronize_player_task.delay(identifier)
        ok = task.get(timeout=10)

        response = {"ok": ok}
        if ok:
            player = Player.find_existing(identifier)
            response["id"] = str(player.id)
            response["personaname"] = player.personaname
            response["resynchronized"] = player.resynchronized

        logging.info(response)
        return ResynchronizePlayer(**response)


class Mutation(graphene.ObjectType):
    # create_player = CreatePlayer.Field()
    resynchronize_player = ResynchronizePlayer.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
