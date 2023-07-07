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

    def __init__(self, stats: List, achievements: List):
        self.stats = list(map(lambda stat: GameStat(**stat), stats))
        self.achievements = list(map(lambda achievement: GameAchievement(**achievement), achievements))


@dataclass
class GameSchema:
    gameName: str
    gameVersion: str
    availableGameStats: AvailableGameStats

    def __init__(self, gameName: str, gameVersion: str, availableGameStats: List):
        self.gameName = gameName
        self.gameVersion = gameVersion
        self.availableGameStats = AvailableGameStats(**availableGameStats)
