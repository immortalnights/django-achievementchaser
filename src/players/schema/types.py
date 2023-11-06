import graphene
from ..models import PlayerUnlockedAchievement
from games.models import Achievement
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
