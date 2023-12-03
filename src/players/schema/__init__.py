from graphene import ObjectType
from .types import PlayerType
from .players import Query as PlayerQuery


class Queries(
    PlayerQuery,
    ObjectType,
):
    pass


__all__ = [
    "PlayerType",
]
