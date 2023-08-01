import graphene
from graphene_django import DjangoObjectType  # noqa F401
from players.schema import PlayerQuery, ProfileQuery, ResynchronizePlayer, ResynchronizePlayerGame
from games.schema import GameQuery, ResynchronizeGame
import achievements.schema


class Queries(
    PlayerQuery,
    ProfileQuery,
    GameQuery,
    graphene.ObjectType,
):
    pass


class Mutations(graphene.ObjectType):
    resynchronize_player = ResynchronizePlayer.Field()
    resynchronize_player_game = ResynchronizePlayerGame.Field()
    resynchronize_game = ResynchronizeGame.Field()


schema = graphene.Schema(query=Queries, mutation=Mutations)
