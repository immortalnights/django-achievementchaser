import time
from django.core.management.base import BaseCommand, CommandError
from players.models import Player
# from players.tasks import resynchronize_player


def resynchronize_player(logger, identity):
    """
    :param logger: logger instance of command logger wrapper
    """
    logger.info("beginning")
    # logger.info(f"Beginning resynchronization of Player {id}")
    try:
        player = Player.objects.get(id=int(identity))
        logger.info(f"got {player.personaname}")
    except Player.DoesNotExist:
        logger.error("nope!")
    time.sleep(1)
    logger.info("done")
    return f"Done {identity} X"


class CommandLogger:
    cmd = None

    def __init__(self, cmd):
        self.cmd = cmd

    def debug(self, message):
        self.cmd.stdout.write(message)

    def info(self, message):
        self.cmd.stdout.write(message)

    def warning(self, message):
        self.cmd.stdout.write(message)

    def error(self, message):
        self.cmd.stderr.write(message)


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument('identity', nargs=1, type=str)

    def handle(self, *args, **options):
        logger = CommandLogger(self)
        identity = options["identity"][0]
        logger.info(f"resynchronize '{identity}'")
        # r = resynchronize_player.delay(identity)
        r = resynchronize_player(logger, identity)

        # TODO handle celery.exceptions.TimeoutError
        logger.info(f"Result {r}")
