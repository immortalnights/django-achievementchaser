import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .models import Player, Friend

logger = logging.getLogger("schema")

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
            logger.warning(f"Could not find Player with ID={id} or name={name}")
            resp = None

        return resp
