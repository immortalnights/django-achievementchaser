mock_game_achievement_percentages_empty = {"achievementpercentages": {"achievements": []}}

mock_game_achievement_percentages_no_achievements = {"achievementpercentages": {}}

mock_game_achievement_percentages_invalid = {}

mock_game_achievement_percentages = {
    "achievementpercentages": {
        "achievements": [
            {"name": "ACHIEVE_CHAP_1_COMPLETE", "percent": 88.0999984741211},
            {"name": "ACHIEVE_CHAP_2_COMPLETE", "percent": 79.4000015258789},
            {"name": "ACHIEVE_CHAP_3_COMPLETE", "percent": 73.5999984741211},
            {"name": "ACHIEVE_CHAP_4_COMPLETE", "percent": 71.19999694824219},
            {"name": "ACHIEVE_CHAP_5_COMPLETE", "percent": 66.5},
        ]
    }
}

mock_fake_game_achievement_percentages = {
    "achievementpercentages": {"achievements": [{"name": "FakeAchievement", "percent": 99.99}]}
}
