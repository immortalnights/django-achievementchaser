from graphene import ObjectType
from .types import GameType, AchievementType
from .games import Query as GameQuery


class Queries(
    GameQuery,
    ObjectType,
):
    pass


__all__ = ["GameType", "AchievementType", "GameMinimalType"]
