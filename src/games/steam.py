import logging
import typing
from achievementchaser import steam
from .responsedata import GameSchema


def load_game_schema(id: int) -> typing.Optional[GameSchema]:
    schema = None
    try:
        response = steam.request(
            "ISteamUserStats/GetSchemaForGame/v2/",
            {
                "appid": id,
            },
            "game",
        )

        if response and "gameName" in response:
            schema = GameSchema(**response)
    except Exception:
        logging.exception(f"Failed to load game schema for {id}")

    return schema
