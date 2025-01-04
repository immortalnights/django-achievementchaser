from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from . import steam
from players.models import Player
from .utilities import can_resynchronize_model


class PlayerIdentityTests(TestCase):
    def test_cannot_make_steam_request_while_testing(self):
        self.assertRaises(AssertionError, steam.request, "anyPath", {}, "anyKey")


class UtilityTests(TestCase):
    def test_can_resynchronize_model(self):
        model = Player(id=100005, name="Test Player")

        self.assertTrue(can_resynchronize_model(model), "A new model should be marked for resynchronization")

        model.resynchronization_required = False
        model.save()

        # model has no previous resynchronization time, so allows resynchronization
        self.assertTrue(
            can_resynchronize_model(model), "Model with no last resynchronization time, can be resynchronized "
        )

        model.resynchronized = timezone.now()
        model.save()

        self.assertFalse(
            can_resynchronize_model(model), "Model just resynchronized, cannot be immediately resynchronized again"
        )

        model.resynchronized = timezone.now() - timedelta(minutes=5)
        model.save()

        self.assertTrue(can_resynchronize_model(model), "Model should be available for resynchronization")
