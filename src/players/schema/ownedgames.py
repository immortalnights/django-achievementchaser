from typing import Optional
import graphene
from graphene_django import DjangoObjectType
from ..models import PlayerOwnedGame


class PlayerOwnedGameType(DjangoObjectType):
    class Meta:
        model = PlayerOwnedGame
        fields = "__all__"


# class GameType(graphene.ObjectType):
#     id = graphene.BigInt()
#     name = graphene.String()
#     # etc
#     completion_percentage = graphene.String()
#     global_completion_percentage = graphene.String()


class Query(graphene.ObjectType):
    owned_games = graphene.List(PlayerOwnedGameType, player=graphene.BigInt(required=True), order_by=graphene.String())

    def resolve_owned_games(root, info, player: int, order_by: Optional[str] = None):
        order_by_value = "game__name"
        if order_by:
            values = order_by.split(" ")[:2]
            if len(values) < 2:
                values.append("DESC")

            (key, order) = values

            order_modifier = "" if order == "ASC" else "-"

            if key == "completionPercentage":
                order_by_value = f"{order_modifier}completion_percentage"

            if key == "globalPercentage":
                order_by_value = f"{order_modifier}game__difficulty_percentage"

        return PlayerOwnedGame.objects.filter(player=player).order_by(order_by_value).select_related("game")
