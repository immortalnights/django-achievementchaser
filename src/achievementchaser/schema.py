import graphene
from graphene_django import DjangoObjectType  # noqa F401
from players.schema import Queries as PlayerQueries, ResynchronizePlayer, ResynchronizePlayerGame
from games.schema import Queries as GameQueries, ResynchronizeGame


class Queries(
    PlayerQueries,
    GameQueries,
    graphene.ObjectType,
):
    pass


class Mutations(graphene.ObjectType):
    resynchronize_player = ResynchronizePlayer.Field()
    resynchronize_player_game = ResynchronizePlayerGame.Field()
    resynchronize_game = ResynchronizeGame.Field()


schema = graphene.Schema(query=Queries, mutation=Mutations)
