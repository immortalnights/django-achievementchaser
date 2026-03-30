import pytest

from players.models import Player

from .graphql_documents.search_players import DOCUMENT


@pytest.mark.django_db
def test_search_player_success(client_query):
    Player.objects.create(
        id=123456789,
        name="PlayerOne",
        api_key="",
        profile_url="",
        avatar_small_url="",
        avatar_medium_url="",
        avatar_large_url="",
        created=0,
    )

    response = client_query(
        DOCUMENT,
        variables={"name": "PlayerOne"},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {response.json()}"
    assert "errors" not in data
    assert data["data"]["player"]["name"] == "PlayerOne"


@pytest.mark.django_db
def test_search_player_failure(client_query):
    response = client_query(
        DOCUMENT,
        variables={"name": "PlayerOne"},
    )

    data = response.json()

    assert response.status_code == 200, f"Request failed {response.json()}"
    assert "errors" in data
    assert "Could not find Player" in data["errors"][0]["message"]
