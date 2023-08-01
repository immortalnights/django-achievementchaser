from graphene import ObjectType
from .players import Query as PlayerQuery
from .profiles import Query as ProfileQuery
from .ownedgames import Query as OwnedGameQuery
from .mutations import ResynchronizePlayer, ResynchronizePlayerGame


class Queries(
    PlayerQuery,
    ProfileQuery,
    OwnedGameQuery,
    ObjectType,
):
    pass


__all__ = [
    "ResynchronizePlayer",
    "ResynchronizePlayerGame",
]
