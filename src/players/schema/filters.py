from django_filters import (
    FilterSet,
    OrderingFilter,
    NumberFilter,
    BooleanFilter,
)
from ..models import PlayerOwnedGame, PlayerUnlockedAchievement
from games.models import Achievement


def filter_name_matches(key: [str], name: str):
    first_key = key[0]
    return first_key == name or first_key[1:] == name


class PlayerOwnedGameOrderingFilter(OrderingFilter):
    def filter(self, qs, value):
        if value and len(value) > 0:
            if filter_name_matches(value, "last_played"):
                qs = qs.exclude(last_played__isnull=True)
            elif filter_name_matches(value, "game__difficulty_percentage"):
                qs = qs.exclude(game__difficulty_percentage__isnull=True)

        return OrderingFilter.filter(self, qs, value)


class AchievementOrderingFilter(OrderingFilter):
    def filter(self, qs, value):
        if value and len(value) > 0:
            if filter_name_matches(value, "global_percentage"):
                qs = qs.exclude(global_percentage=0.0)

        return OrderingFilter.filter(self, qs, value)


class StartedGameFilter(BooleanFilter):
    def filter(self, qs, value):
        if value is not None:
            if value is True:
                qs = qs.filter(playtime_forever__gt=0, completion_percentage__gt=0)
            else:
                qs = qs.filter(playtime_forever=0, completion_percentage=0)

        return qs


class PlayerUnlockedAchievementFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields = {
            "datetime": ["range"],
        }

    order_by = OrderingFilter(fields=("datetime",))
    year = NumberFilter(field_name="datetime__year")
    game = NumberFilter(field_name="game_id")


class PlayerAvailableAchievementFilter(FilterSet):
    class Meta:
        model = Achievement
        fields: list[str] = []

    order_by = AchievementOrderingFilter(fields=("global_percentage",))
    game = NumberFilter(field_name="game_id")


class PlayerOwnedGameFilter(FilterSet):
    class Meta:
        model = PlayerOwnedGame
        fields: list[str] = []

    order_by = PlayerOwnedGameOrderingFilter(
        fields=("completed", "last_played", "completion_percentage", "game__difficulty_percentage")
    )
    started = StartedGameFilter()
    completed = BooleanFilter(field_name="completed", lookup_expr="isnull", exclude=True)
    year = NumberFilter(field_name="completed__year")
