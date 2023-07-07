from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from games.tasks import resynchronize_game


class Command(BaseCommand):
    help = "Resynchronize game"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", nargs=1, type=str)

    def handle(self, *args, **options):
        """Perform the resynchronization directly of a game."""
        output = CommandOutput(self)
        identity = options["identity"][0]
        resynchronize_game(output, identity)
