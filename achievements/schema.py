import graphene
from graphene_django import DjangoObjectType
from .models import Achievement, AchievementAchiever


class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        fields = "__all__"


class Query(graphene.ObjectType):
    players = graphene.List(AchievementType)

    def resolve_achievements(root, info, **kwargs):
        # Querying a list
        return Achievement.objects.all()

