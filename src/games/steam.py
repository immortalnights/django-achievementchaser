from loguru import logger

from achievementchaser import steam

from .responsedata import AchievementPercentagesResponse, GameSchemaResponse


def load_game_schema(id: int) -> GameSchemaResponse | None:
    schema = None
    try:
        ok, response = steam.request(
            "ISteamUserStats/GetSchemaForGame/v2/",
            {
                "appid": id,
            },
            "game",
        )

        if ok and response and "gameName" in response:
            schema = GameSchemaResponse(**response)
    except Exception:  # noqa: BLE001
        logger.exception(f"Failed to load game schema for {id}")

    return schema


def load_game_achievement_percentages(id: int) -> AchievementPercentagesResponse | None:
    schema = None
    try:
        ok, response = steam.request(
            "ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",
            {
                "gameid": id,
            },
            "achievementpercentages",
            key=False,
        )

        if ok and response and "achievements" in response:
            schema = AchievementPercentagesResponse(**response)
    except Exception:  # noqa: BLE001
        logger.exception(f"Failed to load game achievement percentages for {id}")

    return schema
