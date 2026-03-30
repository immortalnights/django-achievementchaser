DOCUMENT = """
query Search($name: String!) {
    searchPlayersAndGames(name: $name) {
        ... on PlayerType {
            playerId: id
            name
            avatarMediumUrl
        }
        ... on GameType {
            id
            name
            imgIconUrl
            achievementCount
            difficultyPercentage
        }
    }
}
"""
