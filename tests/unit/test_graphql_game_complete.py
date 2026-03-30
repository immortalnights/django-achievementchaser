import pytest

from .graphql_documents.game_complete import DOCUMENT

pytestmark = pytest.mark.django_db


def test_game_complete_document_success(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={"game": graphql_dataset["perfect_game"].id},
    )

    data = response.json()
    game = data["data"]["game"]

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert game["id"] == str(graphql_dataset["perfect_game"].id)
    assert game["achievementCount"] == 3
    assert len(game["owners"]["edges"]) == 2
    assert len(game["achievements"]) == 3


def test_game_complete_document_failure(client_query):
    response = client_query(
        DOCUMENT,
        variables={"game": 999999},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" in data
    assert "Could not find Game" in data["errors"][0]["message"]
