from graphene import ObjectType
from .games import Query as GameQuery
from .mutations import GameMinimalType, ResynchronizeGame


class Queries(
    GameQuery,
    ObjectType,
):
    pass


__all__ = ["GameMinimalType", "ResynchronizeGame"]
