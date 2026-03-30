DOCUMENT = """
query PlayerPerfectGames(
    $player: BigInt!
    $year: Decimal
    $range: [DateTime]
    $orderBy: String
    $limit: Int
    $cursor: String
) {
    player(id: $player) {
        id
        games(
            completed_Isnull: false
            completed_Range: $range
            year: $year
            orderBy: $orderBy
            first: $limit
            after: $cursor
        ) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
            }
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
