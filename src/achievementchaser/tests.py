from django.test import TestCase
from . import steam


class PlayerIdentityTests(TestCase):
    def test_cannot_make_steam_request_while_testing(self):
        self.assertRaises(AssertionError, steam.request, "anyPath", {}, "anyKey")
