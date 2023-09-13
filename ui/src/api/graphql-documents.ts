import { gql } from "graphql-request"

export const boolToString = (bool: boolean) => (bool ? "true" : "false")

export const player = (player: string) => gql`
player(id: ${player}) {
    id
    name
    avatarLargeUrl
    profileUrl
}
`

export const playerProfileSummary = (player: string) => gql`
playerProfileSummary(id: ${player}) {
    ownedGames
    perfectGames
    playedGames
    totalPlaytime
    lockedAchievements
    unlockedAchievements
}`

export const recentGames = (player: string) => gql`
playerGames(id: ${player}, played: true, orderBy: "lastPlayed DESC", limit: 6) {
    edges {
        node {
            id
            name
            imgIconUrl
            lastPlayed
        }
    }
}`

export const recentAchievements = (
    player: string,
    unlocked: boolean,
    limit: number
) => gql`
playerAchievements(
    id: ${player}
    unlocked: ${boolToString(unlocked)}
    limit: ${limit}
) {
    edges {
        node {
            id
            displayName
            iconUrl,
            iconGrayUrl,
            globalPercentage
            unlocked
            game {
                id
                name
            }
        }
    }
}`

export const almostCompleteGames = (player: string) => gql`
playerGames(
    id: ${player}
    orderBy: "completionPercentage DESC"
    played: true
    limit: 12
    started: true
    perfect: false
) {
    totalCount
    edges {
        node {
            id
            name
            completionPercentage
            imgIconUrl
        }
    }
}`

export const justStartedGames = (player: string) => gql`
playerGames(
    id: ${player}
    orderBy: "completionPercentage ASC"
    played: true
    limit: 12
    started: true
) {
    totalCount
    edges {
        node {
            id
            name
            completionPercentage
            imgIconUrl
        }
    }
}`

export const nextGames = (player: string) => gql`
playerGames(
    id: ${player}
    orderBy: "difficultyPercentage DESC"
    limit: 12
    perfect: false
) {
    edges {
        node {
            id
            name
            imgIconUrl
        }
    }
}`

export const game = (game: string) => gql`
game(id: ${game}) {
    id
    name
    difficultyPercentage
}
gameAchievements(id: ${game}) {
    id
    name
    globalPercentage
}`

export const playerGame = (player: string, game: string) => gql`
playerGame(id: ${player}, gameId: ${game}) {
    id
    completionPercentage
    playtimeForever
    last_played
}
playerAchievementsForGame(
    id: ${player}, gameId: ${game}, orderBy: "globalPercentage DESC"
) {
    id
    unlocked
}`

export default {
    player,
    playerProfileSummary,
    recentGames,
    recentAchievements,
    almostCompleteGames,
    justStartedGames,
    nextGames,
    game,
    playerGame,
}
