from django_filters import FilterSet, OrderingFilter, NumberFilter, BooleanFilter
from ..models import PlayerOwnedGame, PlayerUnlockedAchievement
from games.models import Achievement


class PlayerOwnedGameOrderingFilter(OrderingFilter):
    def filter(self, qs, value):
        if value and len(value) > 0:
            if value[0][1:] == "last_played":
                qs = qs.exclude(last_played__isnull=True)
            elif value[0][1:] == "game__difficulty_percentage":
                qs = qs.exclude(game__difficulty_percentage__isnull=True)

        return OrderingFilter.filter(self, qs, value)


class UnlockedAchievementYearFilter(NumberFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(datetime__year=value)

        return res


class GameFilter(NumberFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(game_id=value)

        return res


class StartedGameFilter(BooleanFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            if value is True:
                args = {"playtime_forever__gt": 0, "completion_percentage__gt": 0}
            else:
                args = {"playtime_forever": 0, "completion_percentage": 0}
            res = qs.filter(**args)

        return res


class CompletedGameFilter(BooleanFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(completed__isnull=not value)

        return res


class GameCompletedYearFilter(NumberFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(completed__year=value)

        return res


class PlayerUnlockedAchievementFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields: list[str] = []  # {"game_id: [], "datetime": ["year"]}

    order_by = OrderingFilter(fields=("datetime",))
    year = UnlockedAchievementYearFilter()
    game = GameFilter()


class PlayerAvailableAchievementFilter(FilterSet):
    class Meta:
        model = Achievement
        fields: list[str] = []

    game = GameFilter()


class PlayerOwnedGameFilter(FilterSet):
    class Meta:
        model = PlayerOwnedGame
        fields: list[str] = []

    order_by = PlayerOwnedGameOrderingFilter(
        fields=("completed", "last_played", "completion_percentage", "game__difficulty_percentage")
    )
    started = StartedGameFilter()
    completed = CompletedGameFilter()
    year = GameCompletedYearFilter()
