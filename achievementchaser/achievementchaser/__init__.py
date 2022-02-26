
# monkeypath django for graphene-django
# https://github.com/graphql-python/graphene-django/issues/1284#issuecomment-1019998091
import os
import logging
import django
from django.utils.encoding import force_str
django.utils.encoding.force_text = force_str

logger = logging.getLogger(__name__)

class AppConfig(django.apps.AppConfig):
    name = "achievementchaser"

    def ready(self):

        if "STEAM_API_KEY" not in os.environ:
            logging.error("STEAM_API_KEY is not defined")
        else:
            logging.info("Steam API set")
