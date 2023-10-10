import typing
from loguru import logger
from achievementchaser import steam
from .responsedata import GameSchemaResponse


def load_game_schema(id: int) -> typing.Optional[GameSchemaResponse]:
    schema = None
    try:
        ok, response = steam.request(
            "ISteamUserStats/GetSchemaForGame/v2/",
            {
                "appid": id,
            },
            "game",
        )

        if response and "gameName" in response:
            schema = GameSchemaResponse(**response)
    except Exception:
        logger.exception(f"Failed to load game schema for {id}")

    return schema
