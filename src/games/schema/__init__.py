from graphene import ObjectType

from .games import Query as GameQuery
from .types import AchievementType, GameType


class Queries(
    GameQuery,
    ObjectType,
):
    pass


__all__ = ["AchievementType", "GameType"]
