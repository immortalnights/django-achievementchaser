import pytest

from .graphql_documents.player_profile import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_profile_document_success(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={"player": graphql_dataset["player"].id, "year": 2025},
    )

    data = response.json()
    profile = data["data"]["player"]["profile"]

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert data["data"]["player"]["name"] == graphql_dataset["player"].name
    assert profile["ownedGames"] == 3
    assert profile["perfectGames"] == 2
    assert profile["playedGames"] == 3
    assert profile["totalPlaytime"] == 420
    assert profile["unlockedAchievements"] == 3
    assert profile["unlockedAchievementForYear"] == 3
    assert profile["perfectGamesForYear"] == 2
