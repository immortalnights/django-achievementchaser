from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from games.models import Game
from games.tasks import resynchronize_game_task


class Command(BaseCommand):
    help = "Resynchronize game"

    def add_arguments(self, parser) -> None:
        parser.add_argument("game", help="")

    def handle(self, *args, **options):
        """Perform the resynchronization directly of a game."""
        output = CommandOutput(self)
        identity = options["game"]

        try:
            output.info(f"Beginning resynchronization of Game {identity}")
            response = resynchronize_game_task(identity)

            game_name = (
                response["game"].name if response and "game" in response and response["game"] is not None else identity
            )

            if response and response["ok"] is True:
                output.info(f"Resynchronization of Game '{game_name}' succeeded")
            else:
                output.info(f"Resynchronization of Game '{game_name}' failed")

        except Game.DoesNotExist:
            output.error(f"Game '{identity}' does not exist")
