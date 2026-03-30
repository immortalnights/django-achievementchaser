import pytest

from .graphql_documents.player_perfect_games import DOCUMENT

pytestmark = pytest.mark.django_db


def test_player_perfect_games_document_paginates(client_query, graphql_dataset):
    variables = {
        "player": graphql_dataset["player"].id,
        "year": 2025,
        "range": [
            graphql_dataset["completed_at_older"].isoformat(),
            graphql_dataset["completed_at_newer"].isoformat(),
        ],
        "orderBy": "-completed",
        "limit": 1,
    }

    first_response = client_query(DOCUMENT, variables=variables)
    first_data = first_response.json()
    first_page = first_data["data"]["player"]["games"]

    assert first_response.status_code == 200, f"Request failed {first_data}"
    assert "errors" not in first_data
    assert len(first_page["edges"]) == 1
    assert first_page["edges"][0]["node"]["game"]["id"] == str(graphql_dataset["perfect_game_two"].id)
    assert first_page["pageInfo"]["hasNextPage"] is True

    second_response = client_query(
        DOCUMENT,
        variables={**variables, "cursor": first_page["pageInfo"]["endCursor"]},
    )
    second_data = second_response.json()
    second_page = second_data["data"]["player"]["games"]

    assert second_response.status_code == 200, f"Request failed {second_data}"
    assert "errors" not in second_data
    assert len(second_page["edges"]) == 1
    assert second_page["edges"][0]["node"]["game"]["id"] == str(graphql_dataset["perfect_game"].id)
