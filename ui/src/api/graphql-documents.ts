import { gql } from "graphql-request"

export const boolToString = (bool: boolean) => (bool ? "true" : "false")

export const playerDocument = ({
    player,
    profile = false,
}: {
    player: string
    profile?: boolean
}) => {
    let profileGQL = ""
    if (profile) {
        profileGQL = gql`profile {
            ownedGames
            perfectGames
            playedGames
            totalPlaytime
            lockedAchievements
            unlockedAchievements
        }`
    }

    return gql`
    player(id: ${player}) {
        id
        name
        avatarLargeUrl
        profileUrl
        ${profileGQL}
    }`
}

export interface PlayerGamesQueryParameters {
    player: string
    started?: boolean
    completed?: boolean
    year?: number
    orderBy?: string
    limit?: number
}

export const playerGamesDocument = ({
    player,
    started,
    completed,
    year,
    orderBy,
    limit,
}: PlayerGamesQueryParameters) => {
    const queryParameters: string[] = []

    if (started !== undefined) {
        queryParameters.push(`started: ${boolToString(started)}`)
    }

    if (completed != undefined) {
        queryParameters.push(`completed: ${boolToString(completed)}`)
    }

    if (year !== undefined) {
        queryParameters.push(`year: ${year}`)
    }

    if (orderBy !== undefined) {
        queryParameters.push(`orderBy: "${orderBy}"`)
    }

    if (limit !== undefined) {
        queryParameters.push(`first: ${limit}`)
    }

    return gql`
    player(id: ${player}) {
        id
        games(${queryParameters.join(", ")}) {
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
    }`
}

export const playerGameDocument = ({
    player,
    game,
}: {
    player: string
    game: string
}) => gql`
    player(id: ${player}) {
        id
        game(game: "${game}") {
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
                    unlockedAchievements
                }
            }
        }
    }`

export interface PlayerAchievementsQueryParameters {
    player: string
    game?: string
    year?: number
    orderBy?: string
    limit?: number
}

export const playerAchievementsDocument = ({
    player,
    game,
    year,
    orderBy,
    limit,
}: PlayerAchievementsQueryParameters) => {
    const queryParameters: string[] = []
    if (game !== undefined) {
        queryParameters.push(`game: ${game}`)
    }

    if (year !== undefined) {
        queryParameters.push(`year: ${year}`)
    }

    if (orderBy !== undefined) {
        queryParameters.push(`orderBy: "${orderBy}"`)
    }

    if (limit !== undefined) {
        queryParameters.push(`first: ${limit}`)
    }

    return gql`
    player(id: ${player}) {
        id
        unlockedAchievements(${queryParameters.join(", ")}) {
            edges {
                node {
                    id
                    game {
                        id
                        name
                        imgIconUrl
                    }
                    achievement {
                        id
                        displayName
                        iconUrl
                    }
                }
            }
        }
    }`
}

// export const recentGames = (player: string) => gql`
// playerGames(id: ${player}, played: true, orderBy: "lastPlayed DESC", limit: 6) {
//     edges {
//         node {
//             id
//             name
//             imgIconUrl
//             lastPlayed
//         }
//     }
// }`

// export const recentAchievements = (
//     player: string,
//     unlocked: boolean,
//     limit: number
// ) => gql`
// playerAchievements(
//     id: ${player}
//     unlocked: ${boolToString(unlocked)}
//     limit: ${limit}
// ) {
//     edges {
//         node {
//             id
//             displayName
//             iconUrl,
//             iconGrayUrl,
//             globalPercentage
//             unlocked
//             game {
//                 id
//                 name
//                 difficultyPercentage
//                 achievementCount
//             }
//         }
//     }
// }`

// export const timelineAchievements = (player: string, year: number) => gql`
// playerAchievements(
//     id: ${player}
//     unlocked: true
//     year: ${year}
// ) {
//     edges {
//         node {
//             id
//             unlocked
//         }
//     }
// }`

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

// export const playerGame = (player: string, game: string) => gql`
// playerGame(id: ${player}, gameId: ${game}) {
//     id
//     completionPercentage
//     playtimeForever
//     last_played
// }
// playerAchievementsForGame(
//     id: ${player}, gameId: ${game}, orderBy: "globalPercentage DESC"
// ) {
//     id
//     unlocked
// }`

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
    playerDocument,
    playerGamesDocument,
    playerAchievementsDocument,
    game,
    // gameAchievements,
    // gameOwners,
    search,
}
