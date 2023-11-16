import graphene
from graphene_django import DjangoObjectType  # noqa F401
from players.models import Player
from players.schema import PlayerType, Queries as PlayerQueries, ResynchronizePlayer, ResynchronizePlayerGame
from games.models import Game
from games.schema import GameType, Queries as GameQueries, ResynchronizeGame


class ResultType(graphene.Union):
    class Meta:
        types = (PlayerType, GameType)


class Search(graphene.ObjectType):
    search_players_and_games = graphene.List(ResultType, name=graphene.String())

    def resolve_search_players_and_games(self, info, name):
        players = Player.objects.filter(name__icontains=name)
        games = Game.objects.filter(name__icontains=name)

        return list(players) + list(games)


class Queries(
    PlayerQueries,
    GameQueries,
    Search,
    graphene.ObjectType,
):
    pass


class Mutations(graphene.ObjectType):
    resynchronize_player = ResynchronizePlayer.Field()
    resynchronize_player_game = ResynchronizePlayerGame.Field()
    resynchronize_game = ResynchronizeGame.Field()


schema = graphene.Schema(query=Queries, mutation=Mutations)
