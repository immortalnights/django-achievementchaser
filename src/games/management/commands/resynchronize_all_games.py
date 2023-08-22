from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from games.tasks import scheduled_resynchronize_games_task


class Command(BaseCommand):
    help = "Resynchronize all games"

    def add_arguments(self, parser) -> None:
        pass

    def handle(self, *args, **options):
        """Perform the resynchronization of all games."""
        output = CommandOutput(self)

        output.info("Beginning resynchronization of all games")
        scheduled_resynchronize_games_task.apply(None, {"asynchronous": False})
        output.info("Completed resynchronization of game")
