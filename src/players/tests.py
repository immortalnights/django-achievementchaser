from dataclasses import dataclass
from django.test import TestCase
from graphene_django.utils.testing import GraphQLTestCase
from unittest.mock import patch
from .models import Player
from .service import (
    parse_identity,
    load_player,
    find_existing_player,
    player_from_identity,
    resynchronize_player_profile,
    resynchronize_player_games,
    resynchronize_player_achievements,
)
from .testdata import mock_vanity_response, mock_player_summary, mock_player_owned_games
from .responsedata import PlayerSummaryResponse


class PlayerIdentityTests(TestCase):
    """Test parse_identity utility"""

    def test_player_from_id(self):
        """Given a valid Steam ID, return a Player ID"""
        player_id = parse_identity("10000000000000001")
        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name(self):
        """Given a valid Friendly Name, create a new Player"""
        player_id = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_vanity_response
            player_id = parse_identity("anonymous")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_url(self):
        """Given a valid user URL, create a new Player"""
        player_id = parse_identity("https://steamcommunity.com/profiles/76561197993451745")
        self.assertEqual(player_id, 76561197993451745)

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_vanity_response
            player_id = parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name_existing(self):
        """Given a valid Friend Name, fetch the existing Player"""

        Player.objects.create(id=10000000000000001)

        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_vanity_response
            player_id = parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

            player = Player.objects.get(id=player_id)
            self.assertIsNotNone(player)


class PlayerTests(TestCase):
    def test_player_from_invalid_id(self):
        """Given an invalid Steam ID, return None"""
        player = player_from_identity("0")
        self.assertIsNone(player)

    def test_player_from_invalid_friendly_name(self):
        """Given an invalid Friendly Name, return None"""
        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"success": 42, "message": "No match"}}
            player = player_from_identity("invalid")
            mock_request.assert_called_once()

        self.assertIsNone(player)

    def test_player_from_invalid_url(self):
        """Given an invalid user URL, return an error"""
        self.assertRaises(RuntimeError, player_from_identity, "https://google.com")

    def test_player_existing_true(self):
        Player.objects.create(id=1, name="rndTest", profile_url="https://example.com/id/1")

        player = find_existing_player(1)
        self.assertIsNotNone(player)

        player = find_existing_player("rndTest")
        self.assertIsNotNone(player)

        player = find_existing_player("https://example.com/id/1")
        self.assertIsNotNone(player)

    def test_player_existing_false(self):
        player = find_existing_player(1)
        self.assertIsNone(player)

    def test_player_changed_name(self):
        Player.objects.create(id=1, name="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = load_player("newName")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)
            # persona name isn't updated unless the player is resynchronized

    def test_player_changed_url(self):
        Player.objects.create(id=1, name="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = load_player("https://steamcommunity.com/profiles/newURL/")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)


class PlayerProfileTests(TestCase):
    """Test resynchronization/parsing player summary"""

    def test_resynchronize_profile_invalid_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": []}}
            resynchronize_player_profile(player)
            mock_request.assert_called_once()

            # Player should not have been resynchronized
            self.assertIsNone(player.resynchronized)

    def test_resynchronize_profile_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": [mock_player_summary]}}
            resynchronize_player_profile(player)
            mock_request.assert_called_once()

            self.assertEqual(player.name, "testName")
            self.assertEqual(player.profile_url, "testURL")
            self.assertEqual(player.avatar_small_url, "testAvatarS")
            self.assertEqual(player.avatar_medium_url, "testAvatarM")
            self.assertEqual(player.avatar_large_url, "testAvatarL")


class PlayerResynchronizeGamesTests(TestCase):
    """Test resynchronization/parsing player games"""

    def test_load_owned_games(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_player_owned_games
            resynchronize_player_games(player)


class PlayerResynchronizeAchievementsTests(TestCase):
    """Test resynchronization/parsing player achievements"""

    pass


class PlayerResynchronizeTests(TestCase):
    """Test resynchronization of player"""

    pass


class MockTask:
    return_value: None

    def __init__(self, return_value):
        self.return_value = return_value

    def get(self, timeout: int = 0):
        return self.return_value


@dataclass
class ResynchronizePlayerResponse:
    ok: bool
    id: str = ""
    name: str = ""
    resynchronized: bool = False
    error: str = ""

    @staticmethod
    def parse_response(response):
        result = None
        response_json = response.json()
        response_data = response_json["data"] if "data" in response_json else None
        if response_data:
            result = ResynchronizePlayerResponse(**response_data["resynchronizePlayer"])

        return result


class PlayerAPITests(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/graphql/"

    def test_query_player(self):
        pass

    def test_resynchronize_player_request(self):
        with patch("players.schema.find_existing_player") as mock_request:
            mock_request.return_value = Player(id=1, name="TestUser", resynchronized=True)

            with patch("players.tasks.resynchronize_player_task.delay") as mock_task_request:
                mock_task_request.return_value = MockTask(True)
                response = self.query(
                    """
    mutation TestMutation {
        resynchronizePlayer(identifier: "TestUser") {
            ok
            id
            name
            error
        }
    }
"""
                )
                mock_task_request.assert_called_once_with("TestUser")
                mock_request.assert_called_once_with("TestUser")

                data = ResynchronizePlayerResponse.parse_response(response)
                self.assertIsInstance(data, ResynchronizePlayerResponse)
                self.assertTrue(data.ok)
                self.assertEqual(data.id, "1")
                self.assertEqual(data.name, "TestUser")

    def test_resynchronize_unknown_player_request(self):
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_vanity_response
            response = self.query(
                """
    mutation TestMutation {
        resynchronizePlayer(identifier: "TestUser") {
            ok
            id
            name
            error
        }
    }
"""
            )

            data = ResynchronizePlayerResponse.parse_response(response)
            self.assertIsInstance(data, ResynchronizePlayerResponse)
            self.assertFalse(data.ok)
            self.assertEqual(data.error, "Player 'TestUser' does not exist")
