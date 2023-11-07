from django_filters import FilterSet, OrderingFilter, NumberFilter, BooleanFilter
from ..models import PlayerOwnedGame, PlayerUnlockedAchievement
from games.models import Achievement


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


class PlayedGameFilter(BooleanFilter):
    def filter(self, qs, value):
        res = qs
        if value is not None:
            if value is True:
                args = {"playtime_forever__gt": 0}
            else:
                args = {"playtime_forever": 0}
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

    order_by = OrderingFilter(fields=("completed", "last_played"))
    played = PlayedGameFilter()
    completed = PerfectGameFilter()
