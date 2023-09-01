from graphene import ObjectType
from .players import Query as PlayerQuery
from .mutations import ResynchronizePlayer, ResynchronizePlayerGame


class Queries(
    PlayerQuery,
    ObjectType,
):
    pass


__all__ = [
    "ResynchronizePlayer",
    "ResynchronizePlayerGame",
]
