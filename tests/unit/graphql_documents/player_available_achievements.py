DOCUMENT = """
query PlayerAvailableAchievements(
    $player: BigInt!
    $locked: Boolean
    $orderBy: String
    $limit: Int
) {
    player(id: $player) {
        id
        availableAchievements(
            locked: $locked
            orderBy: $orderBy
            first: $limit
        ) {
            edges {
                node {
                    id
                    displayName
                    iconUrl
                    iconGrayUrl
                    game {
                        id
                        name
                        imgIconUrl
                        achievementCount
                        difficultyPercentage
                    }
                }
            }
        }
    }
}
"""
