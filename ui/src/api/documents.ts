import { gql } from "graphql-request"

export const players = gql`query Players() {
    players {
        id
        name
    }
}`

export const player = gql`
    query PlayerProfile($player: BigInt!) {
        player(id: $player) {
            id
            name
            avatarLargeUrl
            profileUrl
        }
    }
`

export const playerProfile = gql`query PlayerProfile(player: BigInt!) {
    player(id: $player) {
        id
        name
        avatarLargeUrl
        profileUrl
        profile {
            ownedGames
            perfectGames
            playedGames
            totalPlaytime
            lockedAchievements
            unlockedAchievements
        }
    }
}`

export const playerGames = gql`
    query PlayerGames(
        $player: BigInt!
        $started: Boolean
        $completed: Boolean
        $year: Decimal
        $orderBy: String
        $limit: Number
    ) {
        player(id: $player) {
            id
            games(
                started: $started
                completed: $completed
                year: $year
                orderBy: $orderBy
                first: $limit
            ) {
                edges {
                    node {
                        game {
                            name
                            id
                            imgIconUrl
                            achievementCount
                            difficultyPercentage
                        }
                        completed
                        lastPlayed
                        playtimeForever
                        unlockedAchievementCount
                    }
                }
            }
        }
    }
`

export const playerGame = gql`query PlayerGame(
    player: BigInt!
    game: String!
) {
    player(id: $player) {
        id
        game(game: $game) {
            game {
                name
                id
                imgIconUrl
                difficultyPercentage
                achievements {
                    id
                    displayName
                    description
                    hidden
                    globalPercentage
                    iconUrl
                    iconGrayUrl
                }
            }
            completed
            lastPlayed
            playtimeForever
            unlockedAchievements {
                datetime
                achievement {
                    id
                    displayName
                }
            }
        }
    }
}`

export const playerUnlockedAchievements = gql`query PlayerUnlockedAchievements(
    player: BigInt!,
    game: String,
    year: Decimal,
    orderBy: String,
    limit: Numeric,
) {
    player(id: $player) {
        id
        unlockedAchievements(
            game: $game,
            year: $year,
            orderBy: $orderBy,
            first: $limit,
            after: $cursor,
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
                    game {
                        id
                        name
                        imgIconUrl
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
}`

export const playerAvailableAchievements = gql`
    query PlayerAvailableAchievements(
        $player: BigInt!
        $orderBy: String
        $limit: Number
    ) {
        player(id: $player) {
            id
            availableAchievements(orderBy: $orderBy, first: $limit) {
                edges {
                    node {
                        id
                        displayName
                        description
                        globalPercentage
                        iconGrayUrl
                        game {
                            id
                            name
                            imgIconUrl
                            difficultyPercentage
                            achievementCount
                        }
                    }
                }
            }
        }
    }
`

export const game = gql`
    query Game($game: String) {
        game(id: $game) {
            id
            name
            difficultyPercentage
            achievementCount
        }
    }
`
export const gameComplete = gql`
    query Game($game: Int!) {
        game(id: $game) {
            id
            name
            difficultyPercentage
            achievementCount
            owners {
                edges {
                    node {
                        player {
                            id
                            name
                            avatarSmallUrl
                        }
                        lastPlayed
                        playtimeForever
                        completionPercentage
                        completed
                    }
                }
            }
            achievements {
                id
                displayName
                description
                hidden
                iconUrl
                iconGrayUrl
                globalPercentage
            }
        }
    }
`

export const search = gql`query Search(name: String!) {
    searchPlayersAndGames(name: $name) {
        ... on PlayerType {
            id
            name
            avatarMediumUrl
        }
        ... on GameType {
            id
            name
            imgIconUrl
        }
    }
}`
