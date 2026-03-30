DOCUMENT = """
query PlayerGames(
    $player: BigInt!
    $started: Boolean
    $incomplete: Boolean
    $orderBy: String
    $limit: Int
) {
    player(id: $player) {
        id
        games(
            started: $started
            completed_Isnull: $incomplete
            orderBy: $orderBy
            first: $limit
        ) {
            edges {
                node {
                    game {
                        id
                        name
                        imgIconUrl
                        achievementCount
                        difficultyPercentage
                    }
                    lastPlayed
                    playtimeForever
                    unlockedAchievementCount
                    completed
                }
            }
        }
    }
}
"""
