import graphene
from graphene_django import DjangoObjectType
import players.schema
import games.schema
import achievements.schema


class Query(
    players.schema.Query,
    games.schema.Query,
    achievements.schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    players.schema.Mutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
