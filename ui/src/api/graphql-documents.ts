import { gql } from "graphql-request"

export const player = (player: string) => gql`
player(id: ${player}) {
    id
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
playerGames(id: ${player}, played: true, orderBy: "lastPlayed DESC") {
    edges {
        node {
            gameId
            name
            imgUrl
        }
    }
}`

export const recentAchievements = (player: string) => gql`
playerAchievements(id: ${player}, limit: 6, unlocked: true) {
    edges {
        node {
            id
            displayName
            unlocked
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
            gameId
            name
            completionPercentage
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
            gameId
            name
            completionPercentage
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
            gameId
            name
            imgUrl
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
    id: ${player}
    gameId: ${game}
    orderBy: "globalPercentage DESC"
  ) {
    id
    unlocked
}`
