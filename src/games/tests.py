import logging
from django.test import TestCase
from graphene_django.utils.testing import GraphQLTestCase
from unittest import skip
from unittest.mock import patch
from .models import Game
from .service import resynchronize_game, resynchronize_game_schema
from .testdata import (
    mock_fake_game_schema,
    mock_real_game_schema,
    mock_game_schema_no_available_game_stats,
    mock_game_schema_empty_available_game_stats,
    mock_game_schema_no_achievements,
    mock_game_schema_no_stats,
)
from achievements.testdata import mock_fake_game_achievement_percentages
from achievementchaser.testdata import mock_invalid_key


class GameCanResynchronizeTests(TestCase):
    def test_can_resynchronize(self):
        pass

    def test_cannot_resynchronize(self):
        pass

    def test_resynchronize_required(self):
        pass

    def test_resynchronize_throttle(self):
        pass


class GameResynchronizeTests(TestCase):
    def test_resynchronize_game(self):
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.side_effect = [mock_fake_game_schema, mock_fake_game_achievement_percentages]
            resynchronize_game(game)
            mock_request.assert_called()

        self.assertIsNotNone(game.resynchronized)
        self.assertIsNotNone(game.name, "FakeGame")
        self.assertEqual(len(game.achievements), 1)
        self.assertEqual(game.achievements[0].global_percentage, 99.99)

    def test_resynchronize_without_achievements(self):
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.side_effect = [mock_fake_game_schema]
            resynchronize_game(game, resynchronize_achievements=False)
            mock_request.assert_called_once()

        self.assertIsNotNone(game.resynchronized)
        self.assertIsNotNone(game.name, "FakeGame")
        self.assertEqual(len(game.achievements), 1)
        self.assertEqual(game.achievements[0].global_percentage, None)

    def test_invalid_game(self):
        """No schema for game"""
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.side_effect = [{}]
            resynchronize_game(game, resynchronize_achievements=False)
            mock_request.assert_called_once()

        self.assertIsNotNone(game.resynchronized)
        self.assertIsNotNone(game.name, "FakeGame")
        self.assertEqual(len(game.achievements), 0)

    def test_game_with_different_name(self):
        """Game with name, schema has different name"""
        pass

    def test_game_without_available_game_stats(self):
        pass

    def test_game_without_stats(self):
        pass

    def test_game_without_achievements(self):
        pass


class GameTests(TestCase):
    #     def test_resynchronize_new_game_task(self):
    #         game = Game(id=1)
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.side_effect = [mock_game_schema, {"achievementpercentages": {"achievements": []}}]
    #             resynchronize_game_schema(game)
    #             mock_request.assert_called_once()

    #         game = Game.objects.get(id=1)
    #         self.assertEqual(game.name, "The Room")
    #         self.assertEqual(len(game.achievements), 5)

    #     def test_resynchronize_existing_game_task(self):
    #         game = Game(id=288160)
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.return_value = mock_game_schema
    #             resynchronize_game_schema(game)
    #             mock_request.assert_called_once()

    #         game = Game.objects.get(id=288160)
    #         self.assertEqual(game.name, "The Room")
    #         self.assertEqual(len(game.achievements), 5)

    #     def test_resynchronize_new_game(self):
    #         game = Game(id=288160)
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.return_value = mock_game_schema
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         game = Game.objects.get(id=288160)
    #         self.assertEqual(game.name, "The Room")
    #         self.assertEqual(len(game.achievements), 5)

    #     # python .\manage.py test games.tests.GameTests.test_resynchronize_existing_game
    #     def test_resynchronize_existing_game(self):
    #         game = Game.objects.create(id=288160)
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.return_value = mock_game_schema
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         self.assertEqual(game.name, "The Room")
    #         self.assertEqual(len(game.achievements), 5)

    #     def test_resynchronize_invalid_game(self):
    #         game = Game(id=1)
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.return_value = {"game": {}}
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         with patch("achievementchaser.steam._request") as mock_request:
    #             mock_request.return_value = {}
    #             # Maybe this should be an exception
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #     def test_resynchronize_incomplete_data(self):
    #         with patch("achievementchaser.steam._request") as mock_request:
    #             game = Game(id=1)
    #             mock_request.return_value = mock_game_schema_no_available_game_stats
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         with patch("achievementchaser.steam._request") as mock_request:
    #             game = Game(id=1)
    #             mock_request.return_value = mock_game_schema_empty_available_game_stats
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         with patch("achievementchaser.steam._request") as mock_request:
    #             game = Game(id=1)
    #             mock_request.return_value = mock_game_schema_no_achievements
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    #         with patch("achievementchaser.steam._request") as mock_request:
    #             game = Game(id=1)
    #             mock_request.return_value = mock_game_schema_no_stats
    #             resynchronize_game(game)
    #             mock_request.assert_called_once()

    def test_resynchronize_invalid_api_key(self):
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_invalid_key
            resynchronize_game(game)
            mock_request.assert_called_once()


class GameAPITests(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/graphql/"

    def test_query_game(self):
        pass

    @skip
    def test_resynchronize_game_request(self):
        with patch("games.tasks.resynchronize_game_task.delay") as mock_request:
            self.query(
                """
    mutation TestMutation {
        resynchronizeGame(identifier: 244850) {
            id
            resynchronized
            name
            ok
        }
    }
"""
            )
            mock_request.assert_called_once_with(244850)

    def test_resynchronize_unknown_game_request(self):
        pass
