import pytest

from .graphql_documents.player_games import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_games_document_success(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={
            "player": graphql_dataset["player"].id,
            "started": True,
            "incomplete": True,
            "orderBy": "-lastPlayed",
            "limit": 1,
        },
    )

    data = response.json()
    edges = data["data"]["player"]["games"]["edges"]

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert len(edges) == 1
    assert edges[0]["node"]["game"]["id"] == str(graphql_dataset["incomplete_game"].id)
    assert edges[0]["node"]["playtimeForever"] == 60
    assert edges[0]["node"]["completed"] is None
    assert edges[0]["node"]["unlockedAchievementCount"] == 1
