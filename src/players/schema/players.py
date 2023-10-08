from loguru import logger
from typing import Optional, List
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q, Sum
from achievementchaser.graphql_utils import parse_order_by, get_field_selection_hierarchy, get_edge_node_fields
from achievements.models import Achievement
from ..models import Player, PlayerOwnedGame, PlayerUnlockedAchievement
from games.schema.games import GameType
from ..queries import get_player_games2


def transform_unlocked_achievement(achievement: PlayerUnlockedAchievement, *, requires_game_data: bool):
    obj = {
        "id": achievement.achievement.name,
        "game": achievement.game,
        "display_name": achievement.achievement.display_name,
        "description": achievement.achievement.description,
        "icon_url": achievement.achievement.icon_url,
        "icon_gray_url": achievement.achievement.icon_gray_url,
        "global_percentage": achievement.achievement.global_percentage or 0,
        "unlocked": achievement.datetime if achievement.datetime is not None else None,
    }

    return obj


class SimpleGameType(graphene.ObjectType):
    class Meta:
        interfaces = (graphene.Node,)

    id = graphene.NonNull(graphene.ID)
    name = graphene.String()
    img_icon_url = graphene.String()
    difficulty_percentage = graphene.Float()
    playtime = graphene.Int()
    playtime_forever = graphene.Int()
    last_played = graphene.DateTime()
    completion_percentage = graphene.Float()
    completed = graphene.DateTime()
    achievement_count = graphene.Int()
    unlocked_achievement_count = graphene.Int()

    def resolve_id(root, info):
        return root.game_id

    def resolve_name(root, info):
        return root.game.name

    def resolve_img_icon_url(root, info):
        return root.game.img_icon_url

    def resolve_difficulty_percentage(root, info):
        return root.game.difficulty_percentage

    def resolve_achievement_count(root, info):
        return Achievement.objects.filter(game_id=root.game_id).count()

    def resolve_unlocked_achievement_count(root, info):
        return PlayerUnlockedAchievement.objects.filter(player_id=root.player_id, game_id=root.game_id).count()


class SimpleAchievementType(graphene.ObjectType):
    id = graphene.NonNull(graphene.String)
    display_name = graphene.String()
    game = graphene.Field(GameType)
    display_name = graphene.String()
    description = graphene.String()
    icon_url = graphene.String()
    icon_gray_url = graphene.String()
    global_percentage = graphene.Float()
    unlocked = graphene.DateTime()

    def resolve_global_percentage(root, info):
        return (root.global_percentage if isinstance(root, Achievement) else root["global_percentage"]) or 0


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


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        # fields = "__all__"

        # fields = ["id", "name"]
        exclude = ["resynchronization_required", "playerownedgame_set", "playerunlockedachievement_set"]

    # Override the model ID otherwise JavaScript rounds the number
    id = graphene.String()


class PlayerProfile(graphene.ObjectType):
    id = graphene.String()
    total_playtime = graphene.Int()

    owned_games = graphene.Int()
    played_games = graphene.Int()
    perfect_games = graphene.Int()

    unlocked_achievements = graphene.Int()
    locked_achievements = graphene.Int()

    def resolve_total_playtime(root, info):
        res = get_player_games2(player=root.id, played=True).aggregate(Sum("playtime_forever"))
        return res["playtime_forever__sum"]

    def resolve_owned_games(root, info):
        return get_player_games2(player=root.id).count()

    def resolve_played_games(root, info):
        return get_player_games2(player=root.id, played=True).count()

    def resolve_perfect_games(root, info):
        return get_player_games2(player=root.id, perfect=True).count()

    def resolve_unlocked_achievements(root, info):
        return PlayerUnlockedAchievement.objects.filter(player_id=root.id).count()

    def resolve_locked_achievements(root, info):
        owned_games = PlayerOwnedGame.objects.filter(player_id=root.id)
        return Achievement.objects.filter(game__in=owned_games.values("game")).count()


class Query(graphene.ObjectType):
    player = graphene.Field(PlayerType, id=graphene.BigInt(), name=graphene.String())
    players = graphene.List(PlayerType)

    player_profile_summary = graphene.Field(PlayerProfile, id=graphene.BigInt())

    player_games = graphene.Field(
        xPlayerGameType,
        id=graphene.BigInt(),
        played=graphene.Boolean(),
        perfect=graphene.Boolean(),
        started=graphene.Boolean(),
        unlocked_achievements=graphene.Boolean(),
        year_completed=graphene.Int(),
        limit=graphene.Int(),
        order_by=graphene.String(),
    )

    player_game = graphene.Field(
        SimpleGameType,
        id=graphene.BigInt(),
        game_id=graphene.BigInt(),
    )

    player_achievements = graphene.Field(
        xPlayerAchievementType,
        id=graphene.BigInt(),
        unlocked=graphene.Boolean(),
        year=graphene.Int(),
        limit=graphene.Int(),
    )

    player_achievements_for_game = graphene.Field(
        graphene.List(SimpleAchievementType),
        id=graphene.BigInt(),
        game_id=graphene.BigInt(),
        order_by=graphene.String(),
    )

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

    def resolve_player_profile_summary(root, info, id: int):
        return PlayerProfile(id=id)

    def resolve_player_games(
        root,
        info: graphene.ResolveInfo,
        id: str,
        played: Optional[bool] = None,
        perfect: Optional[bool] = None,
        started: Optional[bool] = None,
        unlocked_achievements: Optional[bool] = None,
        year_completed: Optional[int] = None,
        limit: Optional[int] = None,
        order_by: Optional[str] = None,
    ):
        selected_field_hierarchy = get_field_selection_hierarchy(info.field_nodes)
        node_fields = list(get_edge_node_fields(selected_field_hierarchy).keys())

        # Only load game data if game specific fields are requested (anything but id)
        requires_game_data = len([item for item in node_fields if item not in ["id"]]) > 0 if node_fields else False

        games = get_player_games2(
            player=id,
            played=played,
            perfect=perfect,
            started=started,
            unlocked_achievements=unlocked_achievements,
            year=year_completed,
            order_by=order_by,
        )

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
                lambda owned_game: {"node": owned_game},
                games,
            ),
        }

    def resolve_player_game(
        root,
        info: graphene.ResolveInfo,
        id: str,
        game_id: str,
    ):
        game = None
        try:
            game = PlayerOwnedGame.objects.get(player_id=id, game_id=game_id)

        except PlayerOwnedGame.DoesNotExist:
            logger.error(f"Player {id} does not own game {game_id}")

        return game

    def resolve_player_achievements_for_game(
        root,
        info,
        id: str,
        game_id: Optional[str] = None,
        order_by: Optional[str] = None,
    ):
        unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player_id=id, game_id=game_id)

        if order_by:
            (key, order_modifier) = parse_order_by(order_by)

            if key == "datetime":
                unlocked_achievements = unlocked_achievements.order_by(f"{order_modifier}datetime")
            elif key == "globalPercentage":
                unlocked_achievements = unlocked_achievements.order_by(
                    f"{order_modifier}achievement__global_percentage"
                )

            else:
                logger.error(f"Unknown order by key '{key}'")

        return map(
            lambda achievement: transform_unlocked_achievement(achievement, requires_game_data=False),
            unlocked_achievements,
        )

    def resolve_player_achievements(
        root,
        info,
        id: str,
        unlocked: Optional[bool] = None,
        year: Optional[int] = None,
        limit: Optional[int] = None,
    ):
        selected_field_hierarchy = get_field_selection_hierarchy(info.field_nodes)
        node_fields = get_edge_node_fields(selected_field_hierarchy)
        game_fields = list(node_fields["game"].keys()) if node_fields and "game" in node_fields else []
        requires_game_data = len([item for item in game_fields if item not in ["id"]]) > 0

        owned_games = PlayerOwnedGame.objects.filter(player_id=id)
        available_achievements = Achievement.objects.filter(game__in=owned_games.values("game"))
        unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player_id=id)

        achievements = []
        total_count = None

        if unlocked is True:
            if year is not None:
                unlocked_achievements = unlocked_achievements.filter(datetime__year=year)

            total_count = unlocked_achievements.count() if "totalCount" in selected_field_hierarchy else None

            if "edges" in selected_field_hierarchy:
                unlocked_achievements = unlocked_achievements.order_by("-datetime").select_related("achievement")

                if limit:
                    unlocked_achievements = unlocked_achievements[:limit]

                if requires_game_data:
                    unlocked_achievements.select_related("game")

                achievements = map(
                    lambda achievement: transform_unlocked_achievement(
                        achievement, requires_game_data=requires_game_data
                    ),
                    unlocked_achievements,
                )

        elif unlocked is False:
            available_achievements = available_achievements.exclude(
                id__in=unlocked_achievements.values("achievement__id")
            )

            total_count = available_achievements.count() if "totalCount" in selected_field_hierarchy else None

            if "edges" in selected_field_hierarchy:
                available_achievements = available_achievements.order_by("-global_percentage")

                if limit:
                    available_achievements = available_achievements[:limit]

            achievements = available_achievements

        else:
            available_achievements = available_achievements.order_by("-global_percentage")
            total_count = available_achievements.count() if "totalCount" in selected_field_hierarchy else None

            if "edges" in selected_field_hierarchy:
                # Index unlocked achievements
                unlocked_achievements = unlocked_achievements.select_related("achievement")
                indexed_unlocked_achievements = {obj.achievement.name: obj for obj in unlocked_achievements}

                def create_achievement(achievement: Achievement):
                    unlocked_achievement = (
                        indexed_unlocked_achievements[achievement.name]
                        if (achievement.name in indexed_unlocked_achievements)
                        else None
                    )

                    return {
                        "id": achievement.name,
                        "game_id": achievement.game_id,
                        "display_name": achievement.display_name,
                        "description": achievement.description,
                        "icon_url": achievement.icon_url,
                        "icon_gray_url": achievement.icon_gray_url,
                        "global_percentage": achievement.global_percentage or 0,
                        "unlocked": unlocked_achievement.datetime if unlocked_achievement else None,
                    }

                if limit:
                    available_achievements = available_achievements[:limit]

                achievements = map(create_achievement, available_achievements)

        return {
            "total_count": total_count,
            "edges": map(
                lambda achievement: {"node": achievement},
                achievements,
            ),
        }
