import logging
import typing
from achievementchaser import steam
from .responsedata import VanityResponse, PlayerSummaryResponse, PlayerOwnedGame


def resolve_vanity_url(name: str) -> typing.Union[int, None]:
    steam_id = None
    try:
        response = steam.request(
            "ISteamUser/ResolveVanityURL/v0001",
            {
                "vanityurl": name,
            },
            "response",
        )

        if "success" in response:
            if response["success"] == 42:
                # No Match
                logging.error(f"No match for name '{name}'")
            elif response["success"] == 1:
                vanity_response = VanityResponse(**response)
                steam_id = int(vanity_response.steamid)
                logging.debug(f"Successfully resolved name {name} to steam id {steam_id}")
        else:
            message = response["message"] if "message" in response else "Unspecified"
            logging.error(f"Failed to resolve name '{name}': {message}")
    except Exception:
        logging.exception("Failed to resolve vanity name")

    return steam_id


def load_player_summary(steam_id: str) -> typing.Optional[PlayerSummaryResponse]:
    summary = None
    try:
        response = steam.request(
            "ISteamUser/GetPlayerSummaries/v0002/",
            {
                "steamids": steam_id,
            },
            "response",
        )

        if response and "players" in response and len(response["players"]) == 1:
            summary = PlayerSummaryResponse(**response["players"][0])
    except Exception:
        logging.exception(f"Failed to load player summary for {steam_id}")

    return summary


def get_friends(steam_id: str):
    pass


def get_owned_games(steam_id: str) -> typing.List[PlayerOwnedGame]:
    owned_games = []
    try:
        response = steam.request(
            "IPlayerService/GetOwnedGames/v0001/",
            {
                "steamid": steam_id,
                "include_appinfo": 1,
                "include_played_free_games": 1,
            },
            "response",
        )

        if response and "games" in response and isinstance(response["games"], list):
            try:
                for game in response["games"]:
                    owned_games.append(PlayerOwnedGame(**game))
            except TypeError:
                logging.exception(f"Failed to parse game\n{game}")
    except Exception:
        logging.exception(f"Failed to get player games for {steam_id}")

    return owned_games
