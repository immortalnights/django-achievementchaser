from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from players.tasks import resynchronize_players_task, resynchronize_players_owned_games_task


class Command(BaseCommand):
    help = "Resynchronize all players"

    def add_arguments(self, parser) -> None:
        pass

    def handle(self, *args, **options):
        """Perform the resynchronization of all players."""
        output = CommandOutput(self)

        output.info("Beginning resynchronization of players")
        resynchronize_players_task(None, {"asynchronous": False})
        resynchronize_players_owned_games_task(None, {"asynchronous": False, "throttle_delay": 1})
        output.info("Completed resynchronization of players")
