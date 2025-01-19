from django.core.management.base import BaseCommand
from django.db.models import Q
from achievementchaser.management.lib.command_output import CommandOutput
from achievementchaser.utilities import can_resynchronize_model
from players.service import (
    load_player,
    resynchronize_player_achievements_for_game,
)
from players.models import Player, PlayerOwnedGame
from games.service import resynchronize_game


class Command(BaseCommand):
    help = "Resynchronize player game"

    def add_arguments(self, parser) -> None:
        parser.add_argument("player", help="Player to resynchronize")
        parser.add_argument("game", help="Owned game to resynchronize")

    def handle(self, *args, **options):
        """Perform the resynchronization of a player."""
        output = CommandOutput(self)
        identity = options["player"]
        game_identity = options["game"]

        try:
            player = load_player(identity)

            identity_query = Q(game=int(game_identity)) if game_identity.isdigit() else Q(game__name=game_identity)

            owned_games = PlayerOwnedGame.objects.filter(Q(player=player) & identity_query).select_related("game")

            if len(owned_games) == 1:
                owned_game = owned_games.first()
                game = owned_games.game

                if can_resynchronize_model(owned_game):
                    if resynchronize_game(game) and resynchronize_player_achievements_for_game(player, owned_game):
                        output.info(f"Resynchronization of player game '{game.name}' succeeded")
                    else:
                        output.info(f"Resynchronization of player game '{game.name}' failed")
                else:
                    output.warning(f"Resynchronization of player {player.name} owned game {game.name} blocked")
            elif len(owned_games) == 0:
                output.error(
                    f"Game '{game_identity}' for {player.name} did not resolve to any games. "
                    "Game names are an exact match."
                )
            else:
                output.error(
                    f"Game '{game_identity}' for {player.name} resolved to {len(owned_games)} games, "
                    f"must specify one game"
                )

        except Player.DoesNotExist:
            output.error(f"Player '{identity}' does not exist")
