from django.test import TestCase
from unittest.mock import MagicMock
from .models import Player
from .service import resynchronize_player, resynchronize_player_profile
from achievementchaser.test_utilities import mock_request


player_summary = {
    "response": {
        "players": [
            {
                "steamid": "10000000000000001",
                "communityvisibilitystate": 3,
                "profilestate": 1,
                "personaname": "New Name",
                "profileurl": "https://steamcommunity.com/id/newURL/",
                "avatar": "",
                "avatarmedium": "",
                "avatarfull": "",
                "avatarhash": "",
                "personastate": 0,
                "primaryclanid": "",
                "timecreated": 1279812300,
                "personastateflags": 0,
                "lastlogoff": 0,
            }
        ]
    }
}


class PlayerTests(TestCase):

    @mock_request(data=[player_summary, {"response": {}}])
    def test_player_changed_name(self, mock_request: MagicMock):
        Player.objects.create(
            id=10000000000000001, name="Old Name", profile_url="https://steamcommunity.com/id/oldURL/"
        )

        player = Player.objects.get(id=10000000000000001)
        # persona name isn't updated unless the player is resynchronized
        self.assertEqual(player.name, "Old Name")
        self.assertEqual(player.profile_url, "https://steamcommunity.com/id/oldURL/")

        resynchronize_player(player)

        player.refresh_from_db()
        self.assertEqual(player.name, "New Name")
        self.assertEqual(player.profile_url, "https://steamcommunity.com/id/newURL/")


class PlayerSummaryTests(TestCase):
    """Test resynchronization/parsing player summary"""

    @mock_request(data={})
    def test_resynchronize_player_profile_empty_response(self, mock_request: MagicMock):
        """Invalid response data does not raise an exceptions and are silently ignored"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)

    @mock_request(data={"response": {}})
    def test_resynchronize_player_profile_empty_response_object(self, mock_request: MagicMock):
        """Invalid response data does not raise an exceptions and are silently ignored"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)

    @mock_request(data={"response": {"players": []}})
    def test_resynchronize_player_profile_empty_players(self, mock_request: MagicMock):
        """Invalid response data does not raise an exceptions and are silently ignored"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)

    @mock_request(data={"response": {"players": [{}, {}]}})
    def test_resynchronize_player_profile_multiple_players(self, mock_request: MagicMock):
        """Invalid response data does not raise an exceptions and are silently ignored"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)

    @mock_request(data={"response": {"players": [{}]}})
    def test_resynchronize_player_profile_no_attributes(self, mock_request: MagicMock):
        """Player missing (any) data raises a TypeError which is caught and ignored"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)

    @mock_request(data=player_summary)
    def test_resynchronize_player_profile(self, mock_request: MagicMock):
        """Resynchronizing the player profile succeeded, but the player ius not considered resynchronized"""
        player = Player(id=1)
        resynchronize_player_profile(player)
        mock_request.assert_called_once()
        self.assertIsNone(player.resynchronized)
