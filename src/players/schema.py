import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

# from .tasks import resynchronize_player
from .management.commands.resynchronize_player import resynchronize_player
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
        id = graphene.String()

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        ok = False
        try:
            logging.info("Scheduling resynchronize_player task")
            r = resynchronize_player.delay(id)
            ok = r.get(timeout=10)
        except Player.DoesNotExist:
            # Return an error
            logging.warning(f"Failed to find Player {id}")

        return ResynchronizePlayer(ok=ok)


class Mutation(graphene.ObjectType):
    # create_player = CreatePlayer.Field()
    resynchronize_player = ResynchronizePlayer.Field()
