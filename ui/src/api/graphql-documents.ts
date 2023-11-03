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
                difficultyPercentage
                achievementCount
            }
        }
    }
}`

export const timelineAchievements = (player: string, year: number) => gql`
playerAchievements(
    id: ${player}
    unlocked: true
    year: ${year}
) {
    edges {
        node {
            id
            unlocked
        }
    }
}`

export const perfectGames = (player: string, year: number) => gql`
playerGames(
    id: ${player}
    perfect: true
    yearCompleted: ${year}
) {
    edges {
        node {
            id
            name
            completed
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

export const game = (
    game: string,
    {
        includeAchievements = false,
        includeOwners = false,
    }: {
        includeAchievements?: boolean
        includeOwners?: boolean
    }
) => {
    const achievements = gql`achievements {
        id
        displayName
        description
        hidden
        iconUrl
        iconGrayUrl
        globalPercentage
    }`

    const owners = gql`owners {
        player {
            id
            name
            avatarSmallUrl
        }
        lastPlayed
        playtimeForever
        completionPercentage
        completed
    }`

    return gql`
game(id: ${game}) {
    id
    name
    difficultyPercentage
    achievementCount
    ${includeAchievements ? achievements : ""}
    ${includeOwners ? owners : ""}
}`
}

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

export const search = (name: string) => gql`
searchPlayersAndGames(name: "${name}") {
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
`

export default {
    player,
    playerProfileSummary,
    playerGame,
    recentGames,
    recentAchievements,
    timelineAchievements,
    perfectGames,
    almostCompleteGames,
    justStartedGames,
    nextGames,

    game,
    search,
}
