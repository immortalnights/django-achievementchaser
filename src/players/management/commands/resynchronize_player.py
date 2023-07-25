from django.core.management.base import BaseCommand
from achievementchaser.management.lib.command_output import CommandOutput
from players.service import load_player, resynchronize_player, parse_identity
from players.models import Player


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("player", help="Resynchronize the Player")
        parser.add_argument("--create", action="store_true", help="Create the Player if unknown")

    def handle(self, *args, **options):
        """Perform the resynchronization of a player."""
        output = CommandOutput(self)
        identity = options["player"]
        create = options["create"]

        player = load_player(identity)

        if player is None and create is True:
            player_id = parse_identity(identity)
            if player_id is not None:
                output.info(f"Creating new player {player_id}")
                player = Player(id=player_id)

        if player is not None:
            name = player.name or "unknown"
            output.info(f"Beginning resynchronization of Player '{name}' ({identity})")
            if resynchronize_player(player):
                output.info(f"Resynchronization of player '{player.name}' succeeded")
            else:
                output.info(f"Resynchronization of player '{name}' failed")
        else:
            output.error(f"Player '{identity}' does not exist")
