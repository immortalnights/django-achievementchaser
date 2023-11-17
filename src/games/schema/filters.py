from django_filters import FilterSet, OrderingFilter, ModelMultipleChoiceFilter
from players.models import Player, PlayerUnlockedAchievement


class PlayerUnlockedAchievementFilter(FilterSet):
    class Meta:
        model = PlayerUnlockedAchievement
        fields: list[str] = []

    order_by = OrderingFilter(fields=("datetime",))
    player = ModelMultipleChoiceFilter(queryset=Player.objects.all())
