import logging
from typing import Optional, List
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from ..models import Player, PlayerOwnedGame
from games.models import Game


class SimpleAchievementType(graphene.ObjectType):
    name = graphene.String()


class SimpleGameType(graphene.ObjectType):
    class Meta:
        interfaces = (graphene.Node,)

    id = graphene.NonNull(graphene.ID)
    game_id = graphene.NonNull(graphene.String)
    name = graphene.String()
    img_url = graphene.String()
    difficulty_percentage = graphene.Float()
    playtime = graphene.Int()
    completion_percentage = graphene.Float()


class GameCountWithList(graphene.ObjectType):
    count = graphene.Int()
    games = graphene.List(SimpleGameType)


class AchievementCountWithList(graphene.ObjectType):
    count = graphene.Int()
    achievements = graphene.List(SimpleAchievementType)


class xPlayerOwnedGameType(graphene.ObjectType):
    owned_games = graphene.Field(GameCountWithList)
    perfect_games = graphene.Field(GameCountWithList)


class PlayerType(graphene.ObjectType):
    # class Meta:
    #     model = Player
    #     # fields = ["id", "name"]
    #     exclude = ["resynchronization_required", "playerownedgame_set", "playerunlockedachievement_set"]

    # Override the model ID otherwise JavaScript rounds the number
    id = graphene.String()
    name = graphene.String()
    avatar_small_url = graphene.String()
    avatar_medium_url = graphene.String()
    avatar_large_url = graphene.String()
    profile_url = graphene.String()
    resynchronized = graphene.String()

    playtime = graphene.Int()

    owned_games = graphene.Field(GameCountWithList)
    played_games = graphene.Field(GameCountWithList)
    perfect_games = graphene.Field(GameCountWithList)

    highest_completion_game = graphene.List(SimpleGameType)
    lowest_completion_game = graphene.List(SimpleGameType)
    easiest_games = graphene.List(SimpleGameType)

    unlocked_achievements = graphene.Field(AchievementCountWithList)
    locked_achievements = graphene.Field(AchievementCountWithList)


class EmptyObjectType(graphene.ObjectType):
    class Meta:
        name = "player_profile"
        description = "description..."

    id = graphene.String()


class xPlayerGameType(graphene.Connection):
    class Meta:
        node = SimpleGameType

    total_count = graphene.Int()


class xPlayerAchievementType(graphene.Connection):
    class Meta:
        node = SimpleAchievementType

    total_count = graphene.Int()


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.BigInt(), name=graphene.String())
    players = graphene.List(PlayerType)

    player_games = graphene.Field(
        xPlayerGameType,
        id=graphene.BigInt(),
        unplayed=graphene.Boolean(),
        played=graphene.Boolean(),
        perfect=graphene.Boolean(),
    )
    player_achievements = graphene.Field(xPlayerAchievementType, id=graphene.BigInt(), unlocked=graphene.Boolean())

    def resolve_player(root, info, id: Optional[int] = None, name: Optional[str] = None) -> Optional[Player]:
        player = None
        result = Player.objects.filter(Q(id=id) | Q(name__iexact=name))
        if len(result) == 0:
            raise RuntimeError(f"Could not find Player with id '{id}' or name '{name}'")
        elif len(result) > 1:
            raise RuntimeError(f"Found too many matching players with id '{id}' or name '{name}'")
        else:
            player = result.first()

        return player

    def resolve_players(root, info) -> List[Player]:
        return Player.objects.all()

    def resolve_profile(root, info):
        return EmptyObjectType()

    def resolve_player_games(
        root,
        info,
        id: str,
        unplayed: bool = False,
        played: bool = False,
        perfect: bool = False,
    ):
        result = None
        try:
            games = PlayerOwnedGame.objects.filter(player_id=id)

            def get_field_hierarchy(fields):
                obj = {}
                for field in fields:
                    if field.selection_set:
                        obj[field.name.value] = get_field_hierarchy(field.selection_set.selections)
                    else:
                        obj[field.name.value] = []

                return obj

            def get_field_selection_hierarchy(fields):
                # The root can be ignored
                return get_field_hierarchy(info.field_nodes[0].selection_set.selections)

            def get_edge_fields(fields):
                res = None
                if "edges" in fields:
                    if "node" in fields["edges"]:
                        res = list(fields["edges"]["node"].keys())

                return res

            selected_field_hierarchy = get_field_selection_hierarchy(info.field_nodes)
            edge_fields = get_edge_fields(selected_field_hierarchy)

            wants_total_count = "totalCount" in selected_field_hierarchy
            # Only load game data if game specific fields are requested (anything but id/gameId)
            requires_game_data = len([item for item in edge_fields if item not in ["id", "gameId"]]) > 0

            # The flags only really work when mutually exclusive
            if played:
                games = games.filter(playtime_forever__gt=0)

            if unplayed:
                games = games.filter(playtime_forever=0)

            if perfect:
                games = games.filter(completion_percentage=1)

            # If game data is required, populate the entire result object as more than one field does
            # not effect the request speed
            nodes = None
            if requires_game_data:
                nodes = map(
                    lambda owned_game: {
                        "node": {
                            "id": owned_game.id,
                            "game_id": owned_game.game_id,
                            "name": owned_game.game.name,
                            "img_url": owned_game.game.img_icon_url,
                            "difficulty_percentage": owned_game.game.difficulty_percentage,
                            "playtime": owned_game.playtime_forever,
                            "completion_percentage": owned_game.completion_percentage,
                        }
                    },
                    games,
                )
            else:
                nodes = map(
                    lambda owned_game: {
                        "node": {
                            "id": owned_game.id,
                            "game_id": owned_game.game_id,
                        }
                    },
                    games,
                )

            result = {"total_count": games.count() if wants_total_count else None, "edges": nodes}

        except Player.DoesNotExist:
            # result = // error
            pass

        return result
