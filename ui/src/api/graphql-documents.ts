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

    console.assert(
        queryParameters.length > 0,
        "Cannot perform game query with no parameters"
    )

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
    }`

export interface PlayerUnlockedAchievementsQueryParameters {
    player: string
    game?: string
    year?: number
    orderBy?: string
    limit?: number
}

export const playerUnlockedAchievementsDocument = ({
    player,
    game,
    year,
    orderBy,
    limit,
}: PlayerUnlockedAchievementsQueryParameters) => {
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
    }`
}

export interface PlayerAvailableAchievementsQueryParameters {
    player: string
    orderBy?: string
    limit?: number
}

export const playerAvailableAchievementsDocument = ({
    player,
    orderBy = "global_percentage",
    limit,
}: PlayerAvailableAchievementsQueryParameters) => {
    const queryParameters: string[] = []

    if (orderBy !== undefined) {
        queryParameters.push(`orderBy: "${orderBy}"`)
    }

    if (limit !== undefined) {
        queryParameters.push(`first: ${limit}`)
    }

    return gql`
    player(id: ${player}) {
        id
        availableAchievements(${queryParameters.join(", ")}) {
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
    }`
}

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
    playerGameDocument,
    playerGamesDocument,
    playerUnlockedAchievementsDocument,
    playerAvailableAchievementsDocument,
    game,
    search,
}
