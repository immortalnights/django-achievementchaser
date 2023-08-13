import logging
from django.db.models import Q
import graphene
from graphene_django import DjangoObjectType
from ..models import Player, PlayerOwnedGame, PlayerUnlockedAchievement
from achievements.models import Achievement
from achievements.schema import AchievementType


class PlayerAchievementsType(graphene.ObjectType):
    id = graphene.String()
    achievements = graphene.List(AchievementType)


class Query(graphene.ObjectType):
    achievements = graphene.Field(
        PlayerAchievementsType,
        id=graphene.BigInt(required=True),
        game=graphene.BigInt(),
        ignoreUnlocked=graphene.Boolean(),
    )

    def resolve_achievements(root, info, id=None, **kwargs):
        resp = None
        try:
            player = Player.objects.get(id=id)

            owned_games = PlayerOwnedGame.objects.filter(player=player)
            available_achievements = Achievement.objects.filter(game__in=owned_games.values("game"))

            # owned_games = PlayerOwnedGame.objects.filter(player=player)
            print(f"has {owned_games.count()} owned games")

            unlocked_achievements = PlayerUnlockedAchievement.objects.filter(player=player)
            print(f"has {unlocked_achievements.count()} unlocked achievements")

            locked_achievements = available_achievements.exclude(id__in=unlocked_achievements.values("id"))
            print(f"has {available_achievements.count()} achievements to unlock")
            print(f"has {locked_achievements.count()} locked achievements")

            result = locked_achievements.order_by("-global_percentage")[:12]

            for a in result:
                print(a)

            resp = {"id": player.id, "achievements": result}

        except Exception as e:
            logging.exception(e)
        except Player.DoesNotExist:
            logging.warning(f"Could not find Player with id={id}")

        return resp
