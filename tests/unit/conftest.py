from datetime import datetime, timezone

import pytest
from graphene_django.utils.testing import graphql_query

from games.models import Achievement, Game
from players.models import Player, PlayerOwnedGame, PlayerUnlockedAchievement


@pytest.fixture
def client_query(client):
    def func(*args, **kwargs):
        # pyrefly: ignore[bad-keyword-argument]
        return graphql_query(*args, **kwargs, client=client, graphql_url="/graphql/")

    return func


@pytest.fixture
def graphql_dataset():
    player = Player.objects.create(
        id=123456789,
        name="PlayerOne",
        api_key="",
        profile_url="https://steamcommunity.com/id/player-one",
        avatar_small_url="player-small.png",
        avatar_medium_url="player-medium.png",
        avatar_large_url="player-large.png",
        created=0,
    )
    other_player = Player.objects.create(
        id=987654321,
        name="PlayerTwo",
        api_key="",
        profile_url="https://steamcommunity.com/id/player-two",
        avatar_small_url="other-small.png",
        avatar_medium_url="other-medium.png",
        avatar_large_url="other-large.png",
        created=0,
    )

    completed_at_older = datetime(2025, 1, 15, 12, 0, tzinfo=timezone.utc)
    completed_at_newer = datetime(2025, 2, 10, 9, 30, tzinfo=timezone.utc)
    last_played_incomplete = datetime(2025, 3, 1, 18, 45, tzinfo=timezone.utc)
    unlocked_at_older = datetime(2025, 1, 16, 8, 0, tzinfo=timezone.utc)
    unlocked_at_newer = datetime(2025, 1, 18, 20, 15, tzinfo=timezone.utc)

    perfect_game = Game.objects.create(
        id=10,
        name="Perfect Match",
        img_icon_url="perfect.png",
        difficulty_percentage=12.5,
    )
    perfect_game_two = Game.objects.create(
        id=11,
        name="Perfect Match Two",
        img_icon_url="perfect-two.png",
        difficulty_percentage=22.0,
    )
    incomplete_game = Game.objects.create(
        id=12,
        name="Incomplete Match",
        img_icon_url="incomplete.png",
        difficulty_percentage=42.0,
    )
    search_game = Game.objects.create(
        id=13,
        name="PlayerOne Adventures",
        img_icon_url="search.png",
        difficulty_percentage=5.0,
    )

    first_achievement = Achievement.objects.create(
        game=perfect_game,
        name="perfect-1",
        default_value=1,
        display_name="Perfect One",
        hidden=False,
        description="First perfect achievement",
        icon_url="perfect-1.png",
        icon_gray_url="perfect-1-gray.png",
        global_percentage=55.0,
    )
    second_achievement = Achievement.objects.create(
        game=perfect_game,
        name="perfect-2",
        default_value=1,
        display_name="Perfect Two",
        hidden=False,
        description="Second perfect achievement",
        icon_url="perfect-2.png",
        icon_gray_url="perfect-2-gray.png",
        global_percentage=45.0,
    )
    locked_achievement = Achievement.objects.create(
        game=perfect_game,
        name="perfect-locked",
        default_value=1,
        display_name="Perfect Locked",
        hidden=False,
        description="Locked perfect achievement",
        icon_url="perfect-locked.png",
        icon_gray_url="perfect-locked-gray.png",
        global_percentage=65.0,
    )
    perfect_two_achievement = Achievement.objects.create(
        game=perfect_game_two,
        name="perfect-two-1",
        default_value=1,
        display_name="Perfect Two One",
        hidden=False,
        description="Achievement for the second perfect game",
        icon_url="perfect-two-1.png",
        icon_gray_url="perfect-two-1-gray.png",
        global_percentage=35.0,
    )
    incomplete_achievement = Achievement.objects.create(
        game=incomplete_game,
        name="incomplete-1",
        default_value=1,
        display_name="Incomplete One",
        hidden=False,
        description="Achievement for the incomplete game",
        icon_url="incomplete-1.png",
        icon_gray_url="incomplete-1-gray.png",
        global_percentage=25.0,
    )

    PlayerOwnedGame.objects.create(
        player=player,
        game=perfect_game,
        playtime_forever=240,
        completion_percentage=1,
        completed=completed_at_older,
        last_played=completed_at_older,
    )
    PlayerOwnedGame.objects.create(
        player=player,
        game=perfect_game_two,
        playtime_forever=120,
        completion_percentage=1,
        completed=completed_at_newer,
        last_played=completed_at_newer,
    )
    PlayerOwnedGame.objects.create(
        player=player,
        game=incomplete_game,
        playtime_forever=60,
        completion_percentage=0.5,
        completed=None,
        last_played=last_played_incomplete,
    )
    PlayerOwnedGame.objects.create(
        player=other_player,
        game=perfect_game,
        playtime_forever=15,
        completion_percentage=0.5,
        completed=None,
        last_played=unlocked_at_older,
    )

    PlayerUnlockedAchievement.objects.create(
        player=player,
        game=perfect_game,
        achievement=first_achievement,
        datetime=unlocked_at_older,
        playtime=180,
    )
    PlayerUnlockedAchievement.objects.create(
        player=player,
        game=perfect_game,
        achievement=second_achievement,
        datetime=unlocked_at_newer,
        playtime=220,
    )
    PlayerUnlockedAchievement.objects.create(
        player=player,
        game=incomplete_game,
        achievement=incomplete_achievement,
        datetime=last_played_incomplete,
        playtime=60,
    )
    PlayerUnlockedAchievement.objects.create(
        player=other_player,
        game=perfect_game,
        achievement=first_achievement,
        datetime=unlocked_at_older,
        playtime=15,
    )

    return {
        "player": player,
        "other_player": other_player,
        "perfect_game": perfect_game,
        "perfect_game_two": perfect_game_two,
        "incomplete_game": incomplete_game,
        "search_game": search_game,
        "first_achievement": first_achievement,
        "second_achievement": second_achievement,
        "locked_achievement": locked_achievement,
        "perfect_two_achievement": perfect_two_achievement,
        "incomplete_achievement": incomplete_achievement,
        "completed_at_older": completed_at_older,
        "completed_at_newer": completed_at_newer,
        "last_played_incomplete": last_played_incomplete,
        "unlocked_at_older": unlocked_at_older,
        "unlocked_at_newer": unlocked_at_newer,
    }
