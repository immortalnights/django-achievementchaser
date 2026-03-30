import pytest

from .graphql_documents.search import DOCUMENT

pytestmark = pytest.mark.django_db


def test_search_document_returns_players_and_games(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={"name": "PlayerOne"},
    )

    data = response.json()
    results = data["data"]["searchPlayersAndGames"]

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert len(results) == 2
    assert results[0]["name"] == graphql_dataset["player"].name
    assert results[1]["name"] == graphql_dataset["search_game"].name


def test_search_document_returns_empty_list_when_unmatched(client_query):
    response = client_query(
        DOCUMENT,
        variables={"name": "NoSuchName"},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert data["data"]["searchPlayersAndGames"] == []
