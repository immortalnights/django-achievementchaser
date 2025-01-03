from django.test import TestCase
from .service import resolve_identity
from achievementchaser.test_utilities import mock_request


mock_vanity_response = {"response": {"steamid": "10000000000000001", "success": 1}}


class TestResolveIdentity(TestCase):
    """Test resolve_identity utility"""

    def test_resolve_identity_with_id(self):
        """Given a valid Steam ID, return a Player ID"""
        player_id = resolve_identity("10000000000000001")
        self.assertEqual(player_id, 10000000000000001)

    @mock_request(data=mock_vanity_response)
    def test_resolve_identity_from_friendly_name(self, mock_request):
        """Given a valid Friendly Name, resolve to the player id"""
        player_id = resolve_identity("anonymous")
        mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    @mock_request(data=mock_vanity_response)
    def test_resolve_identity_from_url(self, mock_request):
        """Given a valid user URL, resolve to a player id"""
        player_id = resolve_identity("https://steamcommunity.com/profiles/76561197993451745")
        self.assertEqual(player_id, 76561197993451745)

        player_id = resolve_identity("https://steamcommunity.com/id/anonymous/")
        mock_request.assert_called_once()

        self.assertEqual(player_id, 10000000000000001)

    @mock_request(data={"response": {"success": 42, "message": "No match"}})
    def test_resolve_identity_invalid_friendly_name(self, mock_request):
        """Given a valid Friend Name, fetch the existing Player"""

        player_id = resolve_identity("invalid_user")
        self.assertIsNone(player_id)

    @mock_request(data={"response": {"success": 42, "message": "No match"}})
    def test_resolve_identity_invalid_url(self, mock_request):
        """Given a valid Friend Name, fetch the existing Player"""

        # Incorrect amount of url parts
        self.assertRaises(RuntimeError, resolve_identity, "https://google.com")

    @mock_request(data={"response": {"success": 42, "message": "No match"}})
    def test_resolve_identity_invalid_user_url(self, mock_request):
        """Given a valid Friend Name, fetch the existing Player"""

        player_id = resolve_identity("https://steamcommunity.com/id/invalid_user")
        self.assertIsNone(player_id)
