import graphene
from django.db.models import Sum
from achievements.models import Achievement
from ..models import PlayerOwnedGame, PlayerUnlockedAchievement
from ..queries import get_player_games2
from games.schema.games import GameType


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


class xPlayerGameType(graphene.Connection):
    class Meta:
        node = SimpleGameType

    total_count = graphene.Int()


class xPlayerAchievementType(graphene.Connection):
    class Meta:
        node = SimpleAchievementType

    total_count = graphene.Int()


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
