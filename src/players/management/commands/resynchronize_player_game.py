from django.core.management.base import BaseCommand
from django.db.models import Q
from achievementchaser.management.lib.command_output import CommandOutput
from players.service import (
    load_player,
    resynchronize_player_achievements_for_game,
)
from players.models import PlayerOwnedGame
from games.service import resynchronize_game


class Command(BaseCommand):
    help = "Resynchronize player"

    def add_arguments(self, parser) -> None:
        parser.add_argument("player", help="Player to resynchronize")
        parser.add_argument("game", help="Owned game to resynchronize")

    def handle(self, *args, **options):
        """Perform the resynchronization of a player."""
        output = CommandOutput(self)
        identity = options["player"]
        game_identity = options["game"]

        player = load_player(identity)

        if player is not None:
            try:
                identity_query = Q(id=game_identity) if game_identity.isdigit() else Q(game__name=game_identity)

                owned_games = PlayerOwnedGame.objects.filter(Q(player=player) & identity_query).select_related("game")
                if len(owned_games) == 1:
                    game = owned_games.first().game

                    if resynchronize_game(game) and resynchronize_player_achievements_for_game(player, game):
                        output.info(f"Resynchronization of player game '{game.name}' succeeded")
                    else:
                        output.info(f"Resynchronization of player game '{game.name}' failed")
                elif len(owned_games) == 0:
                    output.error(
                        f"Game '{game_identity}' for {player.name} did not resolve to any games. "
                        "Game names are an exact match."
                    )
                else:
                    output.error(
                        f"Game '{game_identity}' for {player.name} resolved to multiple games {len(owned_games)}, "
                        f"must specify one game"
                    )
            except PlayerOwnedGame.DoesNotExist:
                output.error(f"Game '{game_identity}' does not exist as a player owned game")

        else:
            output.error(f"Player '{identity}' does not exist")
