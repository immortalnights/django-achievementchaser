import graphene
from graphene_django import DjangoObjectType
from ..models import Player


class PlayerType(DjangoObjectType):
    class Meta:
        model = Player
        # fields = "__all__"

        # fields = ["id", "name"]
        exclude = ["resynchronization_required", "playerownedgame_set", "playerunlockedachievement_set"]

    # Override the model ID otherwise JavaScript rounds the number
    id = graphene.NonNull(graphene.String)
