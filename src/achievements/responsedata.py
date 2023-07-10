from dataclasses import dataclass
from typing import List, Dict


@dataclass
class AchievementPercentage:
    name: str
    percent: float


@dataclass
class AchievementPercentages:
    achievements: List[AchievementPercentage]

    def __init__(self, achievements: Dict):
        self.achievements = []

        for achievement in achievements:
            self.achievements.append(AchievementPercentage(**achievement))
