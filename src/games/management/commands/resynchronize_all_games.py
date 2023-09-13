from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from games.tasks import resynchronize_games_task


class Command(BaseCommand):
    help = "Resynchronize all games"

    def add_arguments(self, parser) -> None:
        pass

    def handle(self, *args, **options):
        """Perform the resynchronization of all games."""
        output = CommandOutput(self)

        output.info("Beginning resynchronization of all games")
        resynchronize_games_task()
        output.info("Completed resynchronization of game")
