from dataclasses import dataclass
from typing import List, Dict


@dataclass
class AchievementPercentageResponse:
    name: str
    percent: float


@dataclass
class AchievementPercentagesResponse:
    achievements: List[AchievementPercentageResponse]

    def __init__(self, achievements: Dict):
        self.achievements = []

        for achievement in achievements:
            self.achievements.append(AchievementPercentageResponse(**achievement))
