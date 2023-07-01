from django.test import TestCase
from players.models import Player
from unittest.mock import patch


class PlayerIdentityTestCases(TestCase):
    def setUp(self):
        pass

    def test_player_from_id(self):
        """Given a valid Steam ID, return a Player ID"""
        player_id = Player.parse_identity("10000000000000001")
        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name(self):
        """Given a valid Friendly Name, create a new Player"""
        player_id = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = Player.parse_identity("anonymous")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_url(self):
        """Given a valid user URL, create a new Player"""
        player_id = Player.parse_identity("https://steamcommunity.com/profiles/76561197993451745")
        self.assertEqual(player_id, 76561197993451745)

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = Player.parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    def test_player_from_friendly_name_existing(self):
        """Given a valid Friend Name, fetch the existing Player"""

        Player.objects.create(id=10000000000000001)

        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "10000000000000001", "success": 1}}
            player_id = Player.parse_identity("https://steamcommunity.com/id/anonymous/")
            mock_request.assert_called_once()

            player = Player.objects.get(id=player_id)
            self.assertIsNotNone(player)


class PlayerTestCases(TestCase):
    def test_player_from_invalid_id(self):
        """Given an invalid Steam ID, return an error"""
        player = Player.from_identity("0")
        self.assertIsNotNone(player)

    def test_player_from_invalid_friendly_name(self):
        """Given an invalid Friendly Name, return an error"""
        player = None
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"success": 42, "message": "No match"}}
            player = Player.from_identity("invalid")
            mock_request.assert_called_once()

        self.assertIsNone(player)

    def test_player_from_invalid_url(self):
        """Given an invalid user URL, return an error"""
        self.assertRaises(RuntimeError, Player.from_identity, "https://google.com")
