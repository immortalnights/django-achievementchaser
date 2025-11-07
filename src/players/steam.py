import typing
from loguru import logger
from achievementchaser import steam
from typing import Optional, Union
from .responsedata import (
    VanityResponse,
    PlayerSummaryResponse,
    PlayerOwnedGameResponse,
    PlayerUnlockedAchievementResponse,
)


def resolve_vanity_url(name: str) -> typing.Union[int, None]:
    steam_id = None
    try:
        ok, response = steam.request(
            "ISteamUser/ResolveVanityURL/v0001",
            {
                "vanityurl": name,
            },
            "response",
        )

        if ok and response and "success" in response:
            if response["success"] == 42:
                # No Match
                logger.error(f"No match for name '{name}'")
            elif response["success"] == 1:
                vanity_response = VanityResponse(**response)
                steam_id = int(vanity_response.steamid)
                logger.debug(f"Successfully resolved name {name} to steam id {steam_id}")
        else:
            message = response["message"] if response and "message" in response else "Unspecified"
            logger.error(f"Failed to resolve name '{name}': {message}")
    except Exception:
        logger.exception("Failed to resolve vanity name")

    return steam_id


def load_player_summary(steam_id: int) -> typing.Optional[PlayerSummaryResponse]:
    summary = None
    try:
        ok, response = steam.request(
            "ISteamUser/GetPlayerSummaries/v0002/",
            {
                "steamids": steam_id,
            },
            "response",
        )

        if ok and response and "players" in response and len(response["players"]) == 1:
            summary = PlayerSummaryResponse(**response["players"][0])
    except Exception:
        logger.exception(f"Failed to load player summary for {steam_id}")

    return summary


def get_friends(steam_id: int):
    pass


def get_owned_games(steam_id: int, api_key: Optional[str] = None) -> typing.List[PlayerOwnedGameResponse]:
    """Fetch Player owned games.
    Allow the API key to be overwritten so that the player specific key can be used to retrieve all player owned
    game data (I.E., last playtime for games).
    """
    owned_games = []
    try:
        query_properties: dict[str, Union[str, int]] = {
            "steamid": steam_id,
            "include_appinfo": 1,
            "include_played_free_games": 1,
        }

        # The API key from the database may be an empty string
        if api_key:
            query_properties["key"] = api_key

        ok, response = steam.request(
            "IPlayerService/GetOwnedGames/v0001/",
            query_properties,
            "response",
        )

        if ok and response and "games" in response and isinstance(response["games"], list):
            for game in response["games"]:
                try:
                    owned_games.append(PlayerOwnedGameResponse(**game))
                except TypeError:
                    logger.exception(f"Failed to parse game\n{game}")
    except Exception:
        logger.exception(f"Failed to get player games for {steam_id}")

    return owned_games


def get_player_achievements_for_game(steam_id: int, game_id: int) -> typing.List[PlayerUnlockedAchievementResponse]:
    achievements = []
    try:
        ok, response = steam.request(
            "ISteamUserStats/GetPlayerAchievements/v0001/",
            {
                "steamid": steam_id,
                "appid": game_id,
            },
            "playerstats",
        )

        if ok and response and "success" in response:
            if "achievements" in response and isinstance(response["achievements"], list):
                for achievement in response["achievements"]:
                    try:
                        achievements.append(PlayerUnlockedAchievementResponse(**achievement))
                    except TypeError:
                        logger.exception(f"Failed to parse game\n{achievement}")
    except Exception:
        logger.exception(f"Failed to get player games for {steam_id}")

    return achievements
