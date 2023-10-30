from typing import Optional
from loguru import logger
from achievementchaser import steam
from .responsedata import GameSchemaResponse, AchievementPercentagesResponse


def load_game_schema(id: int) -> Optional[GameSchemaResponse]:
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


def load_game_achievement_percentages(id: int) -> Optional[AchievementPercentagesResponse]:
    schema = None
    try:
        ok, response = steam.request(
            "ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",
            {
                "gameid": id,
            },
            "achievementpercentages",
        )

        if response and "achievements" in response:
            schema = AchievementPercentagesResponse(**response)
    except Exception:
        logger.exception(f"Failed to load game achievement percentages for {id}")

    return schema
