from django_filters import FilterSet, OrderingFilter, ModelMultipleChoiceFilter
from players.models import Player, PlayerUnlockedAchievement


class NonNullModelMultipleChoiceFilter(ModelMultipleChoiceFilter):
    always_filter = False

    def filter(self, qs, value):
        if not value:
            raise ValueError("Must provide valid player filter")

        return super().filter(qs, value)


class PlayerOwnedGameFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields: list[str] = []

    order_by = OrderingFilter(fields=("last_played",))
    player = ModelMultipleChoiceFilter(queryset=Player.objects.all())


class PlayerUnlockedAchievementFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields: list[str] = []

    order_by = OrderingFilter(fields=("datetime",))
    player = NonNullModelMultipleChoiceFilter(queryset=Player.objects.all())
