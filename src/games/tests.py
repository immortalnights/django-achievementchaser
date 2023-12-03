from django.test import TestCase
from loguru import logger
from graphene_django.utils.testing import GraphQLTestCase
from unittest import skip
from unittest.mock import patch
from .models import Game
from .tasks import resynchronize_game
from .service import resynchronize_game as resynchronize_game_service
from .testdata import (
    mock_game_schema,
    mock_game_schema_no_available_game_stats,
    mock_game_schema_empty_available_game_stats,
    mock_game_schema_no_achievements,
    mock_game_schema_no_stats,
)
from achievementchaser.testdata import mock_invalid_key


class GameTests(TestCase):
    def test_resynchronize_new_game_task(self):
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_game_schema
            resynchronize_game(logger, 288160)
            mock_request.assert_called_once()

        game = Game.objects.get(id=288160)
        self.assertEqual(game.name, "The Room")
        self.assertEqual(len(game.achievements), 5)

    def test_resynchronize_existing_game_task(self):
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_game_schema
            resynchronize_game(logger, 288160)
            mock_request.assert_called_once()

        game = Game.objects.get(id=288160)
        self.assertEqual(game.name, "The Room")
        self.assertEqual(len(game.achievements), 5)

    def test_resynchronize_new_game(self):
        game = Game.objects.create(id=288160)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_game_schema
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        self.assertEqual(game.name, "The Room")
        self.assertEqual(len(game.achievements), 5)

    # python .\manage.py test games.tests.GameTests.test_resynchronize_existing_game
    def test_resynchronize_existing_game(self):
        game = Game.objects.create(id=288160)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_game_schema
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        self.assertEqual(game.name, "The Room")
        self.assertEqual(len(game.achievements), 5)

    def test_resynchronize_invalid_game(self):
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {"game": {}}
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = {}
            # Maybe this should be an exception
            resynchronize_game_service(game)
            mock_request.assert_called_once()

    def test_resynchronize_incomplete_data(self):
        with patch("achievementchaser.steam._request") as mock_request:
            game = Game(id=1)
            mock_request.return_value = mock_game_schema_no_available_game_stats
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        with patch("achievementchaser.steam._request") as mock_request:
            game = Game(id=1)
            mock_request.return_value = mock_game_schema_empty_available_game_stats
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        with patch("achievementchaser.steam._request") as mock_request:
            game = Game(id=1)
            mock_request.return_value = mock_game_schema_no_achievements
            resynchronize_game_service(game)
            mock_request.assert_called_once()

        with patch("achievementchaser.steam._request") as mock_request:
            game = Game(id=1)
            mock_request.return_value = mock_game_schema_no_stats
            resynchronize_game_service(game)
            mock_request.assert_called_once()

    def test_resynchronize_invalid_api_key(self):
        game = Game(id=1)
        with patch("achievementchaser.steam._request") as mock_request:
            mock_request.return_value = mock_invalid_key
            resynchronize_game_service(game)
            mock_request.assert_called_once()


class GameAPITests(GraphQLTestCase):
    def setUp(self):
        self.GRAPHQL_URL = "/graphql/"

    def test_query_game(self):
        pass
