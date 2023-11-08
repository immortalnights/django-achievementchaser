from django_filters import FilterSet, OrderingFilter, NumberFilter, BooleanFilter
from ..models import PlayerOwnedGame, PlayerUnlockedAchievement
from games.models import Achievement


class PlayerOwnedGameOrderingFilter(OrderingFilter):
    def filter(self, qs, value):
        if len(value) > 0:
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


class AchievementGameFilter(NumberFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(game_id=value)

        return res


class PerfectGameFilter(BooleanFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            res = qs.filter(completed__isnull=not value)

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


class PlayerUnlockedAchievementFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields: list[str] = []  # {"game_id: [], "datetime": ["year"]}

    order_by = OrderingFilter(fields=("datetime",))
    year = UnlockedAchievementYearFilter()
    game = AchievementGameFilter()


class PlayerAvailableAchievementFilter(FilterSet):
    class Meta:
        model = Achievement
        fields: list[str] = []

    game = AchievementGameFilter()


class PlayerOwnedGameFilter(FilterSet):
    class Meta:
        model = PlayerOwnedGame
        fields: list[str] = []  # ["completed", "playtime_forever"]
        # {"completed": ["exact"], "playtime_forever": ["exact", "greater_than"]}

    order_by = PlayerOwnedGameOrderingFilter(
        fields=("completed", "last_played", "completion_percentage", "game__difficulty_percentage")
    )
    started = StartedGameFilter()
    completed = PerfectGameFilter()
