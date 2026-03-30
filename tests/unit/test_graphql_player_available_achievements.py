import pytest

from .graphql_documents.player_available_achievements import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_available_achievements_document_success(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={
            "player": graphql_dataset["player"].id,
            "locked": True,
            "orderBy": "-globalPercentage",
            "limit": 1,
        },
    )

    data = response.json()
    edges = data["data"]["player"]["availableAchievements"]["edges"]

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert len(edges) == 1
    assert edges[0]["node"]["id"] == graphql_dataset["locked_achievement"].name
    assert edges[0]["node"]["game"]["id"] == str(graphql_dataset["perfect_game"].id)
