import graphene
from typing import Optional, List
from django.db.models import Q
from .types import GameListType, GameAchievementListType, GameType
from ..models import Game, Achievement
from players.models import PlayerOwnedGame
from players.schema.types import PlayerType


class GameOwnerType(graphene.ObjectType):
    game = graphene.Field(GameType)
    player = graphene.Field(PlayerType)
    last_played = graphene.DateTime()
    playtime_forever = graphene.Int()
    completion_percentage = graphene.Float()
    completed = graphene.DateTime()


class Query(graphene.ObjectType):
    game = graphene.Field(GameType, id=graphene.Int(), name=graphene.String())
    games = graphene.Field(GameListType, limit=graphene.Int())

    game_achievements = graphene.Field(GameAchievementListType, id=graphene.Int())

    # To replace
    game_owners = graphene.List(GameOwnerType, id=graphene.Int())

    def resolve_game(root, info, id: Optional[int] = None, name: Optional[str] = None) -> Optional[Game]:
        game = None
        result = Game.objects.filter(Q(id=id) | Q(name__iexact=name))
        if len(result) == 0:
            raise RuntimeError(f"Could not find Game with id '{id}' or name '{name}'")
        elif len(result) > 1:
            raise RuntimeError(f"Found too many matching games with id '{id}' or name '{name}'")
        else:
            game = result.first()

        return game

    def resolve_games(root, info, limit: int = 32, **kwargs):
        games = Game.objects.all()
        return {"edges": map(lambda game: {"node": game}, games[:limit]), "total_count": games.count()}

    def resolve_game_achievements(root, info, id: int):
        return Achievement.objects.filter(game_id=id).order_by("-global_percentage")

    def resolve_game_owners(root, info, id: int):
        owners = PlayerOwnedGame.objects.filter(game_id=id)
        return owners
