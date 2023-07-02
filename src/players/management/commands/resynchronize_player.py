import logging
from django.core.management.base import BaseCommand
from players.models import Player
from achievementchaser.management.lib.command_output import CommandOutput

# from players.tasks import resynchronize_player


def resynchronize_player(output: CommandOutput, identity):
    """
    :param logger: logger instance of command logger wrapper
    """
    ok = False
    player_instance = Player.load(identity)

    if player_instance is not None:
        output.info(f"Beginning resynchronization of Player {player_instance.personaname} ({identity})")

        player_instance.resynchronize()

        output.info("Done")

    return ok


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", nargs=1, type=str)

    def handle(self, *args, **options):
        output = CommandOutput(self)
        identity = options["identity"][0]
        logging.info(f"Resynchronize '{identity}'")
        # r = resynchronize_player.delay(identity)
        r = resynchronize_player(output, identity)

        # TODO handle celery.exceptions.TimeoutError
        logging.info(f"Result {r}")
