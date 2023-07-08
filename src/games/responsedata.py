import logging
from dataclasses import dataclass
from typing import List, Dict, Optional


@dataclass
class GameStat:
    name: str
    defaultvalue: str
    displayName: str


@dataclass
class GameAchievement:
    name: str
    defaultvalue: int
    displayName: str
    hidden: bool
    description: str
    icon: str
    icongray: str


@dataclass
class AvailableGameStats:
    stats: List[GameStat]
    achievements: List[GameAchievement]

    def __init__(self, achievements: Optional[List] = None, stats: Optional[List] = None):
        self.achievements = []
        self.stats = []

        if achievements:
            self.achievements = list(map(lambda achievement: GameAchievement(**achievement), achievements))

        if stats:
            self.stats = list(map(lambda stat: GameStat(**stat), stats))


@dataclass
class GameSchema:
    gameName: str
    gameVersion: str
    availableGameStats: AvailableGameStats

    def __init__(self, gameName: str, gameVersion: str, availableGameStats: Optional[Dict] = None):
        self.gameName = gameName
        self.gameVersion = gameVersion

        if availableGameStats:
            self.availableGameStats = AvailableGameStats(**availableGameStats)
        else:
            logging.debug(f"Game {self.gameName} does not have any game stats")
            self.availableGameStats = AvailableGameStats()
