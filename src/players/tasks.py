from loguru import logger
from typing import TypedDict, Union, Optional
from datetime import timedelta
import time
from django.db.models import Q
from django.utils import timezone
from .models import Player, PlayerOwnedGame
from .service import load_player, resynchronize_player, resynchronize_player_achievements_for_game
from achievementchaser.utilities import can_resynchronize_model
from games.service import load_game, resynchronize_game
from games.models import Game


ResynchronizePlayerResponse = TypedDict(
    "ResynchronizePlayerResponse", {"ok": bool, "player": Player, "error": Optional[str]}, total=False
)

ResynchronizePlayerGameResponse = TypedDict(
    "ResynchronizePlayerGameResponse",
    {"ok": bool, "player": Player, "owned_game": PlayerOwnedGame, "error": Optional[str]},
    total=False,
)


def resynchronize_players_task():
    """Resynchronize players that are flagged for resynchronization or have not been resynchronized recently
    Players are resynchronized every hour (there wont ever be many players).
    """
    logger.debug("Begin resynchronization of players")

    due = timezone.now() - timedelta(minutes=10)

    logger.debug(f"Find players last resynchronized before {due}")
    players = Player.objects.filter(Q(resynchronization_required=True) | Q(resynchronized__lt=due))
    logger.debug(f"Found {players.count()} players which require resynchronization")

    # Prevent excessive work if, somehow, there are many players
    limit = 10
    players = players[:limit]

    logger.debug(f"Resynchronizing {players.count()} players")
    for player in players:
        resynchronize_player_task(player.id)


def resynchronize_players_owned_games_task():
    """Resynchronize player owned games that are flagged for resynchronization.
    Intended for when a new player is added.
    """
    logger.debug("Begin resynchronization of player owned games")
    owned_games = PlayerOwnedGame.objects.filter(resynchronization_required=True)
    logger.debug(f"Found {owned_games.count()} owned games which require resynchronization")

    # Prevent excessive work in one event
    limit = 50
    owned_games = owned_games[:limit]

    logger.debug(f"Resynchronizing {owned_games.count()} owned games")
    for owned_game in owned_games:
        try:
            resynchronize_player_game_task(owned_game.player_id, owned_game.game_id)
        except Exception as e:
            logger.error(f"Failed to resynchronize player {owned_game.player_id} owned game {owned_game.game_id}: {e}")

        # Prevent overwhelming the Steam API
        time.sleep(1)


def resynchronize_player_task(identity: Union[str, int]) -> Optional[bool]:
    """Resolves `identity` to a Player and attempts to resynchronize them.

    The resolution is done here so it's in the worker thread."""
    ok = False

    try:
        player = load_player(identity)

        logger.info(f"Beginning resynchronization of Player {player.name} ({player.id})")
        logger.debug(f"Player {player.name} last resynchronized {player.resynchronized}")

        if not can_resynchronize_model(player):
            logger.warning(f"Resynchronization of player {player.name} blocked")
        elif not resynchronize_player(player):
            logger.warning(f"Resynchronization of player {player.name} failed")
        else:
            logger.info(f"Resynchronization of player {player.name} complete")
            ok = True
    except Player.DoesNotExist:
        pass

    return ok


def resynchronize_player_game_task(
    player_identifier: Union[str, int], game_identifier: Union[str, int]
) -> ResynchronizePlayerGameResponse:
    """TODO: Resolves `player` to a Player and `game` to a Game and attempts
    to resynchronize them.

    The resolution is done here so it's in the worker thread."""
    ok = False

    try:
        player = load_player(player_identifier)
    except Player.DoesNotExist as e:
        logger.error(f"Failed to find player {player_identifier}")
        raise e

    try:
        game = load_game(game_identifier)
    except Game.DoesNotExist as e:
        logger.error(f"Failed to find game {game_identifier}")
        raise e

    try:
        if player is not None and game is not None:
            # Use owned game to prevent spam
            owned_game = PlayerOwnedGame.objects.get(player=player.id, game=game.id)
            if can_resynchronize_model(owned_game):
                resynchronize_game(game)
                resynchronize_player_achievements_for_game(player, owned_game)

                owned_game.refresh_from_db()
                ok = True
        else:
            logger.warning(f"Resynchronization of player {player.name} owned game '{game.name}' blocked")

    except PlayerOwnedGame.DoesNotExist as e:
        logger.error(f"Failed to find player {player.name} game '{game.name}'")
        raise e

    return {
        "ok": ok,
        "player": player,
        "owned_game": game,  # owned_game ?
        "error": None,
    }
