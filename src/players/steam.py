import logging
import typing
from achievementchaser import steam


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
                steam_id = int(response["steamid"])
                logging.debug(f"Successfully resolved name {name} to steam id {steam_id}")
        else:
            message = response["message"] if "message" in response else "Unspecified"
            logging.error(f"Failed to resolve name '{name}': {message}")
    except Exception:
        logging.exception("Failed to resolve vanity name")

    return steam_id


def load_player_summary(steam_id: str):
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
            summary = response["players"][0]
            logging.info(summary)
            # TODO check the profile is visible
    except Exception:
        logging.exception(f"Failed to load player summary for {steam_id}")

    return summary


def get_friends(steam_id: str):
    pass


def get_owned_games(steam_id: str):
    games = None
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

        if response and "games" in response:
            games = response["games"]
    except Exception:
        logging.exception(f"Failed to get player games for {steam_id}")

    return games
