from dataclasses import dataclass

from loguru import logger


@dataclass
class GameStat:
    name: str
    defaultvalue: str
    displayName: str


@dataclass
class GameAchievementResponse:
    name: str
    defaultvalue: int
    displayName: str
    hidden: bool
    icon: str
    icongray: str
    description: str | None = ""


@dataclass
class AvailableGameStatsResponse:
    stats: list[GameStat]
    achievements: list[GameAchievementResponse]

    def __init__(self, achievements: list | None = None, stats: list | None = None):
        self.achievements = []
        self.stats = []

        if achievements:
            self.achievements = list(map(lambda achievement: GameAchievementResponse(**achievement), achievements))

        if stats:
            self.stats = list(map(lambda stat: GameStat(**stat), stats))


@dataclass
class GameSchemaResponse:
    gameName: str
    gameVersion: str
    availableGameStats: AvailableGameStatsResponse

    def __init__(self, gameName: str, gameVersion: str, availableGameStats: dict | None = None):
        self.gameName = gameName
        self.gameVersion = gameVersion

        if availableGameStats:
            self.availableGameStats = AvailableGameStatsResponse(**availableGameStats)
        else:
            logger.debug(f"Game {self.gameName} does not have any game stats")
            self.availableGameStats = AvailableGameStatsResponse()


@dataclass
class AchievementPercentageResponse:
    name: str
    percent: float


@dataclass
class AchievementPercentagesResponse:
    achievements: list[AchievementPercentageResponse]

    def __init__(self, achievements: dict):
        self.achievements = []

        for achievement in achievements:
            # Steam is returning the percentage as a string
            achievement["percent"] = float(achievement["percent"])
            self.achievements.append(AchievementPercentageResponse(**achievement))
