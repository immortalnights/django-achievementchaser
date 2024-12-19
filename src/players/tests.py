from django.test import TestCase
from graphene_django.utils.testing import GraphQLTestCase
from unittest.mock import patch
from .models import Player
from .testdata import mock_player_summary, mock_player_owned_games
from .responsedata import PlayerSummaryResponse


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
        Player.objects.create(id=1, name="rndTest", profile_url="https://example.com/id/1")

        player = Player.find_existing(1)
        self.assertIsNotNone(player)

        player = Player.find_existing("rndTest")
        self.assertIsNotNone(player)

        player = Player.find_existing("https://example.com/id/1")
        self.assertIsNotNone(player)

    def test_player_existing_false(self):
        player = Player.find_existing(1)
        self.assertIsNone(player)

    def test_player_changed_name(self):
        Player.objects.create(id=1, name="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = Player.load("newName")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)
            # persona name isn't updated unless the player is resynchronized

    def test_player_changed_url(self):
        Player.objects.create(id=1, name="oldName", profile_url="https://example.com/profiles/oldURL")

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"steamid": "1", "success": 1}}
            instance = Player.load("https://steamcommunity.com/profiles/newURL/")
            mock_request.assert_called_once()

            self.assertIsNotNone(instance)


class PlayerSummaryTests(TestCase):
    """Test resynchronization/parsing player summary"""

    def test_parse_summary(self):
        player = Player(id=2)
        # Raises due to missing "steamid"
        self.assertRaises(AttributeError, player._apply_summary, {})
        # Raises due to mismatching Player IDs
        self.assertRaises(AssertionError, player._apply_summary, PlayerSummaryResponse(**mock_player_summary))

        player = Player(id=1)
        player._apply_summary(PlayerSummaryResponse(**mock_player_summary))
        self.assertEqual(player.name, "testName")
        self.assertEqual(player.profile_url, "testURL")
        self.assertEqual(player.avatar_large_url, "testAvatarL")
        self.assertEqual(player.avatar_medium_url, "testAvatarM")
        self.assertEqual(player.avatar_small_url, "testAvatarS")

    def test_resynchronize_profile_invalid_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": []}}
            player.resynchronize_profile()
            mock_request.assert_called_once()

            # Player should not have been resynchronized
            self.assertIsNone(player.resynchronized)

    def test_resynchronize_profile_player(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"response": {"players": [mock_player_summary]}}
            player.resynchronize_profile()
            mock_request.assert_called_once()

            self.assertEqual(player.name, "testName")
            self.assertEqual(player.profile_url, "testURL")
            self.assertEqual(player.avatar_small_url, "testAvatarS")
            self.assertEqual(player.avatar_medium_url, "testAvatarM")
            self.assertEqual(player.avatar_large_url, "testAvatarL")


class TestPlayerResynchronizeGames(TestCase):
    """Test resynchronization/parsing player games"""

    pass


class TestPlayerResynchronizeAchievements(TestCase):
    """Test resynchronization/parsing player achievements"""

    pass


class TestPlayerResynchronize(TestCase):
    """Test resynchronization of player"""

    pass


class PlayerAPITests(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/graphql/"

    def test_query_player(self):
        pass


class PlayerOwnedGamesTests(TestCase):
    def test_load_owned_games(self):
        player = Player.objects.create(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_player_owned_games
            player.resynchronize_games()
