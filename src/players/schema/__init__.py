from graphene import ObjectType

from .players import Query as PlayerQuery
from .types import PlayerType


class Queries(
    PlayerQuery,
    ObjectType,
):
    pass


__all__ = [
    "PlayerType",
]
