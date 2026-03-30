import pytest

from .graphql_documents.player_unlocked_achievements import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_unlocked_achievements_document_paginates(client_query, graphql_dataset):
    variables = {
        "player": graphql_dataset["player"].id,
        "game": graphql_dataset["perfect_game"].id,
        "year": 2025,
        "range": [
            graphql_dataset["unlocked_at_older"].isoformat(),
            graphql_dataset["unlocked_at_newer"].isoformat(),
        ],
        "orderBy": "-datetime",
        "limit": 1,
    }

    first_response = client_query(DOCUMENT, variables=variables)
    first_data = first_response.json()
    first_page = first_data["data"]["player"]["unlockedAchievements"]

    assert first_response.status_code == 200, f"Request failed {first_data}"
    assert "errors" not in first_data
    assert len(first_page["edges"]) == 1
    assert first_page["edges"][0]["node"]["achievement"]["id"] == graphql_dataset["second_achievement"].name
    assert first_page["pageInfo"]["hasNextPage"] is True

    second_response = client_query(
        DOCUMENT,
        variables={**variables, "cursor": first_page["pageInfo"]["endCursor"]},
    )
    second_data = second_response.json()
    second_page = second_data["data"]["player"]["unlockedAchievements"]

    assert second_response.status_code == 200, f"Request failed {second_data}"
    assert "errors" not in second_data
    assert len(second_page["edges"]) == 1
    assert second_page["edges"][0]["node"]["achievement"]["id"] == graphql_dataset["first_achievement"].name
