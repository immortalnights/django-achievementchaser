import logging
import graphene
from ..models import Player, PlayerOwnedGame, PlayerUnlockedAchievement
from games.models import Game
from achievements.models import Achievement
from achievements.schema import AchievementType


class PlayerAchievementsType(graphene.ObjectType):
    id = graphene.String()
    achievements = graphene.List(AchievementType)


class Query(graphene.ObjectType):
    achievements = graphene.Field(
        PlayerAchievementsType,
        id=graphene.BigInt(required=True),
        limit=graphene.Int(default_value=12),
        game=graphene.BigInt(default_value=None),
        ignore_unlocked=graphene.Boolean(default_value=False),
    )

    def resolve_achievements(root, info, id, limit, game, ignore_unlocked, **kwargs):
        """Return achievements for a player, optionally for a game.

        If `game` is provided, all achievements for that game will be provided,
        otherwise `ignore_unlocked` will exclude unlocked achievements from the result set.
        """

        resp = None
        try:
            player = Player.objects.get(id=id)

            available_achievements = None
            unlocked_achievements = None

            if game:
                game_instance = Game.objects.get(id=game)
                available_achievements = Achievement.objects.filter(game=game_instance)
                unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player=player, game=game)
            else:
                owned_games = PlayerOwnedGame.objects.filter(player=player)
                available_achievements = Achievement.objects.filter(game__in=owned_games.values("game"))
                unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player=player)
                # Only return a maximum of 100 achievements when viewing all player available achievements
                limit = min(limit, 100)

            locked_achievements = available_achievements.order_by("-global_percentage")

            if ignore_unlocked:
                locked_achievements = locked_achievements.exclude(
                    id__in=unlocked_achievements.values("achievement__id")
                )

            resp = {"id": player.id, "achievements": locked_achievements[:limit]}

        except Exception as e:
            logging.exception(e)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with id={id}")
        except Game.DoesNotExist:
            logging.warning(f"Could not find Game with id={game}")

        return resp
