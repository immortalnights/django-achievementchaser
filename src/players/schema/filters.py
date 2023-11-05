from django_filters import FilterSet, OrderingFilter, NumberFilter


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
        fields = ["completed", "playtime_forever"]
        # {"completed": ["exact"], "playtime_forever": ["exact", "greater_than"]}
