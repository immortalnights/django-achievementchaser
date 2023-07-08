import logging
import typing
from achievementchaser import steam
from .responsedata import AchievementPercentages


def load_game_achievement_percentages(id: int) -> typing.Optional[AchievementPercentages]:
    schema = None
    try:
        response = steam.request(
            "ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",
            {
                "gameid": id,
            },
            "achievementpercentages",
        )

        if response and "achievements" in response:
            schema = AchievementPercentages(**response)
    except Exception:
        logging.exception(f"Failed to load game achievement percentages for {id}")

    return schema
