from django.test import TestCase
from unittest import expectedFailure
from .models import Game
from .tasks import resynchronize_game_task
from .service import resynchronize_game as resynchronize_game_service
from .testdata import (
    mock_game_288160_schema,
    mock_game_288160_achievements,
    mock_game_8500_schema,
)
from achievementchaser.test_utilities import mock_request
from unittest.mock import MagicMock


class GameTests(TestCase):

    @mock_request(data=[mock_game_288160_schema, mock_game_288160_achievements])
    def test_resynchronize_new_game(self, mock_request: MagicMock):
        resynchronize_game_service(Game(id=288160))
        mock_request.assert_called()

        game = Game.objects.get(id=288160)
        self.assertEqual(game.name, "The Room")
        self.assertEqual(game.achievements.count(), 5)

    @mock_request(
        data=[
            mock_game_288160_schema,
            mock_game_288160_achievements,
            mock_game_288160_schema,
            mock_game_288160_achievements,
        ]
    )
    def test_resynchronize_game(self, mock_request: MagicMock):
        # Add the game by using the resynchronize_game_service
        resynchronize_game_service(Game(id=288160))

        game = Game.objects.get(id=288160)
        game.resynchronization_required = True
        game.save(update_fields=["resynchronization_required"])

        # Resynchronize an existing game
        resynchronize_game_task(288160)
        mock_request.assert_called()

        game = Game.objects.get(id=288160)
        self.assertEqual(game.name, "The Room")
        self.assertEqual(game.achievements.count(), 5)

    @expectedFailure
    @mock_request(ok=False, data={})
    def test_resynchronize_invalid_game(self, mock_request: MagicMock):

        game = Game(id=1)
        resynchronize_game_service(game)
        mock_request.assert_called_once()

        with self.assertRaises(Game.DoesNotExist):
            Game.objects.get(id=1)

    @mock_request(data=[mock_game_8500_schema])
    def test_resynchronize_game_without_achievements(self, mock_request: MagicMock):
        resynchronize_game_service(Game(id=8500))
        mock_request.assert_called_once()

        game = Game.objects.get(id=8500)
        self.assertEqual(game.name, "EVE Online")
        self.assertEqual(game.achievements.count(), 0)
