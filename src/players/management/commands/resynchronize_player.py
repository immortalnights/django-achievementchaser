from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from players.tasks import resynchronize_player


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", nargs=1, type=str)

    def handle(self, *args, **options):
        """Perform the resynchronization directly (no task)."""
        output = CommandOutput(self)
        identity = options["identity"][0]
        resynchronize_player(output, identity)
