from typing import Optional, List
import logging
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from ..models import PlayerOwnedGame


class PlayerOwnedGameType(DjangoObjectType):
    class Meta:
        model = PlayerOwnedGame
        fields = "__all__"


class Query(graphene.ObjectType):
    owned_games = graphene.List(
        PlayerOwnedGameType,
        player=graphene.BigInt(required=True),
        order_by=graphene.String(),
        limit=graphene.Int(default_value=12),
        ignore_complete=graphene.Boolean(default_value=False),
        ignore_not_started=graphene.Boolean(default_value=False),
        ignore_games=graphene.List(graphene.String),
    )

    def resolve_owned_games(
        root,
        info,
        player: int,
        limit: int,
        ignore_complete: bool,
        ignore_not_started: bool,
        order_by: Optional[str] = None,
        ignore_games: List[str] = [],
    ):
        query = Q(player=player)

        order_by_value = "game__name"
        if order_by:
            values = order_by.split(" ")[:2]
            if len(values) < 2:
                values.append("DESC")

            (key, order) = values

            order_modifier = "" if order == "ASC" else "-"

            if key == "completionPercentage":
                order_by_value = f"{order_modifier}completion_percentage"

                if ignore_complete:
                    query &= Q(completion_percentage__lt=1.0)
                elif ignore_not_started:
                    query &= Q(completion_percentage__gt=0.0)

            elif key == "difficultyPercentage":
                order_by_value = f"{order_modifier}game__difficulty_percentage"

                # Handle games without achievements by requiring a difficulty percentage greater than 0
                query &= Q(game__difficulty_percentage__gt=0.0)

                if ignore_complete:
                    query &= Q(completion_percentage__lt=1.0)
            else:
                logging.error("Unknown order_by key", key)

        return PlayerOwnedGame.objects.filter(query).order_by(order_by_value).select_related("game")[:limit]
