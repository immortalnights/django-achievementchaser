DOCUMENT = """
query PlayerUnlockedAchievements(
    $player: BigInt!
    $game: Decimal
    $year: Decimal
    $range: [DateTime]
    $orderBy: String
    $limit: Int
    $cursor: String
) {
    player(id: $player) {
        id
        unlockedAchievements(
            game: $game
            year: $year
            datetime_Range: $range
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
                    id
                    datetime
                    playtime
                    game {
                        id
                        name
                        imgIconUrl
                        achievementCount
                        difficultyPercentage
                    }
                    achievement {
                        id
                        displayName
                        iconUrl
                        iconGrayUrl
                    }
                }
            }
        }
    }
}
"""
