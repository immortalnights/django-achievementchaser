from dataclasses import dataclass
from typing import List, Dict


@dataclass
class AchievementPercentage:
    name: str
    percentage: float


@dataclass
class AchievementPercentages:
    achievements: List[AchievementPercentage]

    def __init__(self, achievements: Dict):
        self.achievements = []

        for achievement in achievements:
            self.achievements.append(**AchievementPercentage)
