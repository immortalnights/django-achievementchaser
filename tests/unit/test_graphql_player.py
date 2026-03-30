import pytest

from .graphql_documents.player import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_document_success(client_query, graphql_dataset):
    response = client_query(
        DOCUMENT,
        variables={"player": graphql_dataset["player"].id},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" not in data
    assert data["data"]["player"]["id"] == str(graphql_dataset["player"].id)
    assert data["data"]["player"]["profileUrl"] == graphql_dataset["player"].profile_url


def test_player_document_failure(client_query):
    response = client_query(
        DOCUMENT,
        variables={"player": 999999999},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {data}"
    assert "errors" in data
    assert "Could not find Player" in data["errors"][0]["message"]
