DOCUMENT = """
query Game($game: Int!) {
    game(id: $game) {
        id
        name
        imgIconUrl
        achievementCount
        difficultyPercentage
        owners {
            edges {
                node {
                    player {
                        id
                        name
                        avatarSmallUrl
                        avatarMediumUrl
                    }
                    lastPlayed
                    playtimeForever
                    unlockedAchievementCount
                    completed
                }
            }
        }
        achievements {
            id
            displayName
            description
            iconUrl
            iconGrayUrl
            hidden
            globalPercentage
        }
    }
}
"""
