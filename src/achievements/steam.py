import typing
from loguru import logger
from achievementchaser import steam
from .responsedata import AchievementPercentagesResponse


def load_game_achievement_percentages(id: int) -> typing.Optional[AchievementPercentagesResponse]:
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
