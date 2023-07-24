import logging
from dataclasses import dataclass
from typing import List, Dict, Optional


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
    description: Optional[str] = ""


@dataclass
class AvailableGameStatsResponse:
    stats: List[GameStat]
    achievements: List[GameAchievementResponse]

    def __init__(self, achievements: Optional[List] = None, stats: Optional[List] = None):
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

    def __init__(self, gameName: str, gameVersion: str, availableGameStats: Optional[Dict] = None):
        self.gameName = gameName
        self.gameVersion = gameVersion

        if availableGameStats:
            self.availableGameStats = AvailableGameStatsResponse(**availableGameStats)
        else:
            logging.debug(f"Game {self.gameName} does not have any game stats")
            self.availableGameStats = AvailableGameStatsResponse()
