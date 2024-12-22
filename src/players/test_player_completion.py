from django.test import TestCase
from achievementchaser.test_utilities import patch_request
from players.models import Player, PlayerOwnedGame
from players.service import resynchronize_player, resynchronize_player_owned_game
from games.service import load_game, resynchronize_game
from loguru import logger
from copy import deepcopy


class TestPlayerCompletion(TestCase):
    def test_player_has_completed_game(self):
        """Correctly mark and then resynchronize a game which has had it's achievements changed after a player has
        completed it"""

        player = Player(id="76561197993451745")  # 10000000000000001

        with patch_request() as mock_request:
            mock_request.side_effect = [
                (True, mock_player_profile),
                (True, mock_player_owned_games),
                (True, mock_game_255520_schema),
                (True, mock_game_255520_achievements),
                (True, mock_player_stats_for_game_255520_incomplete),
            ]
            res = resynchronize_player(player)

            self.assertTrue(res, f"Failed to resynchronize player {player.id}")

        game = load_game("255520")
        self.assertIsNotNone(game, "Failed to load game 255520")

        owned_game = PlayerOwnedGame.objects.get(player=player, game=game)
        self.assertIsNotNone(owned_game, "Failed to load owned game")
        # Player should not have any progress
        self.assertEqual(owned_game.completion_percentage, 0)

        logger.debug("Updating player completion for game")

        with patch_request() as mock_request:
            mock_request.side_effect = [
                (True, mock_game_255520_schema),
                (True, mock_game_255520_achievements),
                (True, mock_player_stats_for_game_255520_complete),
            ]
            res = resynchronize_player_owned_game(player, owned_game)

            self.assertTrue(res, f"Failed to resynchronize player {player.id} game {owned_game.game.name}")

        # Player should have completed the game
        owned_game.refresh_from_db()
        self.assertEqual(owned_game.completion_percentage, 1.0)

        logger.debug("Resynchronizing game with additional achievement")

        game = owned_game.game

        with patch_request() as mock_request:
            mock_request.side_effect = [
                (True, mock_game_255520_additional_achievement_schema),
                (True, mock_game_255520_achievements),
            ]
            res = resynchronize_game(game)

            self.assertTrue(res, f"Failed to resynchronize player game {game.name}")

        # The player percentage is not updated, but the owned game should be marked as requiring resynchronization
        owned_game.refresh_from_db()
        self.assertEqual(owned_game.resynchronization_required, True)
        self.assertEqual(owned_game.completion_percentage, 1.0)

        with patch_request() as mock_request:
            mock_request.side_effect = [
                (True, mock_game_255520_additional_achievement_schema),
                (True, mock_game_255520_achievements),
                (True, mock_player_stats_for_game_255520_with_additional_achievement),
            ]
            res = resynchronize_player_owned_game(player, owned_game)

            self.assertTrue(res, f"Failed to resynchronize player {player.id} game {owned_game.game.name}")

        # The player no longer has completed this game
        owned_game.refresh_from_db()
        self.assertEqual(owned_game.resynchronization_required, False)
        self.assertNotEqual(owned_game.completion_percentage, 1.0)


mock_player_profile = {
    "response": {
        "players": [
            {
                "steamid": "76561197993451745",
                "communityvisibilitystate": 3,
                "profilestate": 1,
                "personaname": "ImmortalNights",
                "profileurl": "https://steamcommunity.com/id/immortalnights/",
                "avatar": "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91.jpg",
                "avatarmedium": "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_medium.jpg",
                "avatarfull": "https://avatars.steamstatic.com/50fce2d4fbfcc53e9f64a0990964be08d4867f91_full.jpg",
                "avatarhash": "50fce2d4fbfcc53e9f64a0990964be08d4867f91",
                "lastlogoff": 1734829805,
                "personastate": 1,
                "realname": "Andrew K",
                "primaryclanid": "103582791429539327",
                "timecreated": 1192729218,
                "personastateflags": 0,
                "gameextrainfo": "Melvor Idle",
                "gameid": "1267910",
                "loccountrycode": "GB",
                "locstatecode": "D6",
                "loccityid": 17108,
            }
        ]
    }
}

mock_player_owned_games = {
    "response": {
        "game_count": 1914,
        "games": [
            {
                "appid": 255520,
                "name": "Viscera Cleanup Detail: Shadow Warrior",
                "playtime_forever": 33,
                "img_icon_url": "56c3840d52a0da4f397d9991d368c75ed53d99fa",
                "has_community_visible_stats": True,
                "playtime_windows_forever": 0,
                "playtime_mac_forever": 0,
                "playtime_linux_forever": 0,
                "playtime_deck_forever": 0,
                "rtime_last_played": 1515281437,
                "content_descriptorids": [2, 5],
                "playtime_disconnected": 0,
            }
        ],
    }
}

mock_game_255520_schema = {
    "game": {
        "gameName": "Viscera Cleanup Detail: Shadow Warrior",
        "gameVersion": "4",
        "availableGameStats": {
            "stats": [
                {"name": "1_0", "defaultvalue": 0, "displayName": "Achievement_Progress_EVCSW_CompleteCleanup"},
                {"name": "1_1", "defaultvalue": 0, "displayName": "Achievement_Progress_EVCSW_2Million"},
            ],
            "achievements": [
                {
                    "name": "EVCSW_CompleteCleanup",
                    "defaultvalue": 0,
                    "displayName": "Sanitary Supremacy",
                    "hidden": 0,
                    "description": "Completely clean the entire temple and punch out",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/12378f6f462584b879739dd49d4f7dde27220761.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/9fefa3a744adb18b43997c5e63eabf120defd925.jpg",
                },
                {
                    "name": "EVCSW_2Million",
                    "defaultvalue": 0,
                    "displayName": "Mr. Two Million Dollars",
                    "hidden": 0,
                    "description": "Collect the two million dollars of cold hard cash all at once and bring it back to your office using the Trunk",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/5b5103fa5072b6dfeb5fad4923028692bfafb108.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/aea9c6d0ecabf415f8bef423f056f5dab2137c03.jpg",
                },
            ],
        },
    }
}

mock_game_255520_achievements = {
    "achievementpercentages": {
        "achievements": [
            {"name": "EVCSW_CompleteCleanup", "percent": 20.6000003814697266},
            {"name": "EVCSW_2Million", "percent": 11.6000003814697266},
        ]
    }
}

mock_player_stats_for_game_255520_incomplete = {
    "playerstats": {
        "steamID": "76561197993451745",
        "gameName": "Viscera Cleanup Detail: Shadow Warrior",
        "achievements": [
            {"apiname": "EVCSW_CompleteCleanup", "achieved": 0, "unlocktime": 0},
            {"apiname": "EVCSW_2Million", "achieved": 0, "unlocktime": 0},
        ],
        "success": True,
    }
}

mock_player_stats_for_game_255520_complete = {
    "playerstats": {
        "steamID": "76561197993451745",
        "gameName": "Viscera Cleanup Detail: Shadow Warrior",
        "achievements": [
            {"apiname": "EVCSW_CompleteCleanup", "achieved": 1, "unlocktime": 1734697859},
            {"apiname": "EVCSW_2Million", "achieved": 1, "unlocktime": 1734697859},
        ],
        "success": True,
    }
}


def add_achievement_to_game_schema(schema: dict, achievement: dict):
    modified = deepcopy(schema)
    modified["game"]["availableGameStats"]["achievements"].append(achievement)
    return modified


mock_game_255520_additional_achievement_schema = add_achievement_to_game_schema(
    mock_game_255520_schema,
    {
        "name": "NotARealAchievement",
        "defaultvalue": 0,
        "displayName": "Not a real achievement",
        "hidden": 0,
        "description": "Mock data achievement",
        "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/5b5103fa5072b6dfeb5fad4923028692bfafb108.jpg",
        "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/255520/aea9c6d0ecabf415f8bef423f056f5dab2137c03.jpg",
    },
)


mock_player_stats_for_game_255520_with_additional_achievement = {
    "playerstats": {
        "steamID": "76561197993451745",
        "gameName": "Viscera Cleanup Detail: Shadow Warrior",
        "achievements": [
            {"apiname": "EVCSW_CompleteCleanup", "achieved": 1, "unlocktime": 1734697859},
            {"apiname": "EVCSW_2Million", "achieved": 1, "unlocktime": 1734697859},
            {"apiname": "NotARealAchievement", "achieved": 0, "unlocktime": 0},
        ],
        "success": True,
    }
}
