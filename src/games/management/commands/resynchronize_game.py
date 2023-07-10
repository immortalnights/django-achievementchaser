from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from games.models import Game
from games.service import resynchronize_game


class Command(BaseCommand):
    help = "Resynchronize game"

    def add_arguments(self, parser) -> None:
        parser.add_argument("identity", help="")

    def handle(self, *args, **options):
        """Perform the resynchronization directly of a game."""
        output = CommandOutput(self)
        identity = options["identity"]

        try:
            game = Game.objects.get(id=identity)

            output.info(f"Beginning resynchronization of Game '{game.name}' ({identity})")
            if resynchronize_game(game):
                output.info(f"Resynchronization of Game '{game.name}' succeeded")
            else:
                output.info(f"Resynchronization of Game '{game.name}' failed")

        except Game.DoesNotExist:
            output.error(f"Game '{identity}' does not exist")
