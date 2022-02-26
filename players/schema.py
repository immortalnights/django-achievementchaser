from email.policy import default
import logging
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .models import Player, Friend
from . import steam


logger = logging.getLogger()


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


class CreatePlayer(graphene.Mutation):
    class Arguments:
        identity = graphene.String()

    ok = graphene.Boolean(False)
    player = graphene.String() # graphene.Field(lambda: Player)

    @staticmethod
    def mutate(root, info, identity):
        steam_id = None
        if steam.is_player_id(identity):
            # Create player based on Steam ID
            logger.info(f"Identified {identity} as Steam ID, fetching player details")
            steam_id = identity
        else:
            # Lookup player by url name
            logger.info(f"Identified '{identity}' as name, performing lookup")
            steam_id = steam.resolve_vanity_url(identity)

        ok = False
        player = None

        if steam_id:
            player_instance = None
            try:
                player_instance = Player.objects.get(id=steam_id)
            except Player.DoesNotExist as e:
                summary = steam.load_player_summary(steam_id)
                if summary:
                    player_instance = Player(
                        id=summary["steamid"],
                        personaname=summary["personaname"],
                        profile_url=summary["profileurl"],
                        avatar_small_url=summary["avatar"],
                        avatar_medium_url=summary["avatarmedium"],
                        avatar_large_url=summary["avatarfull"],
                        created=summary["timecreated"],
                    )
                    player_instance.save()

            player = player_instance.id if player_instance else None

        return CreatePlayer(player=player, ok=ok)


class Mutation(graphene.ObjectType):
    create_player = CreatePlayer.Field()