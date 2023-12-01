from graphene import ObjectType
from .types import GameType, AchievementType
from .games import Query as GameQuery
from .mutations import GameMinimalType, ResynchronizeGame


class Queries(
    GameQuery,
    ObjectType,
):
    pass


__all__ = ["GameType", "AchievementType", "GameMinimalType", "ResynchronizeGame"]
