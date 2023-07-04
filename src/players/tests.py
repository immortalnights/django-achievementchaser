from django.test import TestCase
from graphene_django.utils.testing import GraphQLTestCase
from unittest.mock import patch
from .models import Player
from .utils import parse_identity
from .testdata import mock_player_summary


class PlayerIdentityTests(TestCase):
    def test_player_from_id(self):
        """Given a valid Steam ID, return a Player ID"""
        player_id = parse_identity("10000000000000001")
        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name(self):
        """Given a valid Friendly Name, create a new Player"""
        player_id = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = parse_identity("anonymous")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_url(self):
        """Given a valid user URL, create a new Player"""
        player_id = parse_identity("https://steamcommunity.com/profiles/76561197993451745")
        self.assertEqual(player_id, 76561197993451745)

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name_existing(self):
        """Given a valid Friend Name, fetch the existing Player"""

        Player.objects.create(id=10000000000000001)

        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

            player = Player.objects.get(id=player_id)
            self.assertIsNotNone(player)


class PlayerTests(TestCase):
    def test_player_from_invalid_id(self):
        """Given an invalid Steam ID, return None"""
        player = Player.from_identity("0")
        self.assertIsNone(player)

    def test_player_from_invalid_friendly_name(self):
        """Given an invalid Friendly Name, return None"""
        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"success": 42, "message": "No match"}}
            player = Player.from_identity("invalid")
            mock_request.assert_called_once()

        self.assertIsNone(player)

    def test_player_from_invalid_url(self):
        """Given an invalid user URL, return an error"""
        self.assertRaises(RuntimeError, Player.from_identity, "https://google.com")

    def test_player_existing_true(self):
        Player.objects.create(id=1, personaname="rndTest", profile_url="https://example.com/id/1")

        player = Player.find_existing(1)
        self.assertIsNotNone(player)

        player = Player.find_existing("rndTest")
        self.assertIsNotNone(player)

        player = Player.find_existing("https://example.com/id/1")
        self.assertIsNotNone(player)

    def test_player_existing_false(self):
        player = Player.find_existing(1)
        self.assertIsNone(player)

    def test_player_changed_personaname(self):
        Player.objects.create(id=1, personaname="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = Player.load("newName")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)

    def test_player_changed_url(self):
        Player.objects.create(id=1, personaname="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = Player.load("https://steamcommunity.com/profiles/newURL/")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)


class PlayerSummaryTests(TestCase):
    def test_parse_summary(self):
        player = Player(id=1)
        # Raises due to missing "steamid"
        self.assertRaises(KeyError, player._parse_summary, {})
        # Raises due to mismatching Player IDs
        self.assertRaises(AssertionError, player._parse_summary, {"steamid": 2})
        # Raises due to missing arguments
        self.assertRaises(TypeError, player._parse_summary, {"steamid": 1})

        player._parse_summary(mock_player_summary)
        self.assertEqual(player.personaname, "testName")
        self.assertEqual(player.profile_url, "testURL")
        self.assertEqual(player.avatar_large_url, "testAvatarL")
        self.assertEqual(player.avatar_medium_url, "testAvatarM")
        self.assertEqual(player.avatar_small_url, "testAvatarS")
        self.assertTrue(player.resynchronized)

    def test_resynchronize_invalid_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": []}}
            player.resynchronize()
            mock_request.assert_called_once()

            # Player should not have been resynchronized
            self.assertIsNone(player.resynchronized)

    def test_resynchronize_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": [mock_player_summary]}}
            player.resynchronize()
            mock_request.assert_called_once()

            # Player should have been resynchronized
            self.assertIsNotNone(player.resynchronized)


class PlayerAPITests(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/graphql/"

    def test_resynchronization_request1(self):
        with patch("players.tasks.resynchronize_player_task.delay") as mock_request:
            self.query(
                """
    mutation TestMutation {
        resynchronizePlayer(identifier: "TestUser") {
            id
            resynchronized
            personaname
            ok
        }
    }
"""
            )
            mock_request.assert_called_once_with("TestUser")
