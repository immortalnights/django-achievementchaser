import dayjs from "dayjs"
import { gql } from "graphql-request"

export const searchPlayers = gql`
    query Search($name: String!) {
        player(name: $name) {
            id
            name
            avatarMediumUrl
        }
    }
`

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

export const playerProfile = gql`
    query PlayerProfile($player: BigInt!, $year: Int = ${dayjs().year()}) {
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
                unlockedAchievementForYear(year: $year)
                perfectGamesForYear(year: $year)
            }
        }
    }
`

export const playerGames = gql`
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
`

export const playerPerfectGames = gql`
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
`

export const playerUnlockedAchievements = gql`
    query PlayerUnlockedAchievements(
        $player: BigInt!
        $game: Int
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
`

export const playerAvailableAchievements = gql`
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
`

export const gameComplete = gql`
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
`

export const search = gql`
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
`
