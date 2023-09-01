import logging
from typing import Optional, List, Dict
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from achievementchaser.graphql_utils import get_field_selection_hierarchy, get_edge_fields
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
        played=graphene.Boolean(),
        perfect=graphene.Boolean(),
        started=graphene.Boolean(),
        has_achievements=graphene.Boolean(),
        limit=graphene.Int(),
        order_by=graphene.String(),
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
        info: graphene.ResolveInfo,
        id: str,
        played: Optional[bool] = None,
        perfect: Optional[bool] = None,
        started: Optional[bool] = None,
        has_achievements: Optional[bool] = None,
        limit: Optional[int] = None,
        order_by: Optional[str] = None,
    ):
        games = PlayerOwnedGame.objects.filter(player_id=id)

        def transform_owned_game_to_node(owned_game: PlayerOwnedGame, requires_game_data: bool = False) -> Dict:
            node = {
                "id": owned_game.id,
                "game_id": owned_game.game_id,
            }

            # If game data is required, populate the entire result object as more than
            #  one field does not effect the request speed
            if requires_game_data:
                node.update(
                    {
                        "name": owned_game.game.name,
                        "img_url": owned_game.game.img_icon_url,
                        "difficulty_percentage": owned_game.game.difficulty_percentage,
                        "playtime": owned_game.playtime_forever,
                        "completion_percentage": owned_game.completion_percentage,
                    }
                )

            return node

        selected_field_hierarchy = get_field_selection_hierarchy(info.field_nodes)
        edge_fields = get_edge_fields(selected_field_hierarchy)

        # Only load game data if game specific fields are requested (anything but id/gameId)
        requires_game_data = (
            len([item for item in edge_fields if item not in ["id", "gameId"]]) > 0 if edge_fields else False
        )

        # The flags only really work when mutually exclusive
        if played is True:
            games = games.filter(playtime_forever__gt=0)
        elif played is False:
            games = games.filter(playtime_forever=0)

        if perfect is True:
            games = games.filter(completion_percentage=1)
        elif perfect is False:
            games = games.filter(completion_percentage__lt=1)

        if started is True:
            games = games.filter(completion_percentage__gt=0)
        elif started is False:
            games = games.filter(completion_percentage=0)

        if has_achievements is True:
            games = games.filter(game__difficulty_percentage__isnull=False)
        elif has_achievements is False:
            games = games.filter(game__difficulty_percentage__isnull=True)

        def parse_order_by(value: str):
            values = order_by.split(" ")[:2]
            if len(values) < 2:
                values.append("ASC")
            elif values[1] not in ("ASC", "DESC"):
                values[1] = "ASC"

            return values

        if order_by:
            (key, order) = parse_order_by(order_by)

            order_modifier = "" if order == "ASC" else "-"

            order_by_value = None
            if key == "name":
                order_by_value = f"{order_modifier}game__name"
            elif key == "completionPercentage":
                order_by_value = f"{order_modifier}completion_percentage"

                # Only consider games with achievements
                games = games.filter(game__difficulty_percentage__gt=0.0)

            elif key == "difficultyPercentage":
                order_by_value = f"{order_modifier}game__difficulty_percentage"

                # Only consider games with achievements
                games = games.filter(game__difficulty_percentage__gt=0.0)
            else:
                logging.error(f"Unknown order by key '{key}'")

            if order_by_value:
                games = games.order_by(order_by_value)

        # Get the total count before limiting the return results, but after filtering
        total_count = games.count() if "totalCount" in selected_field_hierarchy else None

        if limit is not None:
            games = games[:limit]

        # If game data is required, select_related optimizes the db lookup for the game data.
        # Without it, each game is fetched as the PlayerOwnedGame is iterated.
        # Basically; this makes it 10x faster!
        if requires_game_data:
            games = games.select_related("game")

        return {
            "total_count": total_count,
            "edges": map(
                lambda owned_game: {"node": transform_owned_game_to_node(owned_game, requires_game_data)},
                games,
            ),
        }
