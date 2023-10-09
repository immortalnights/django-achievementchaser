import { useEffect } from "react"
import { gql } from "graphql-request"
import gqlDocument, { boolToString } from "./graphql-documents"
import { useQuery } from "./base-query"

export const useLazyQueryPlayers = () => {
    return useQuery<PlayerQueryResponse, Player>(
        (player: string) => gql`player(name: "${player}") {
    id
}
`,
        (response) => response.player,
        true
    )
}

export const useQueryPlayer = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        Player
    >(gqlDocument.player, (response) => response.player)

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    return { loading, error, data }
}

export const useQueryPlayerProfileSummary = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerProfileSummaryResponse,
        PlayerProfileSummary
    >(
        gqlDocument.playerProfileSummary,
        (response) => response.playerProfileSummary
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerOwnedGames = ({
    player,
    played,
    perfect,
    started,
    unlockedAchievements,
    limit,
    orderBy,
}: {
    player: string
    played?: boolean
    perfect?: boolean
    started?: boolean
    unlockedAchievements?: boolean
    limit?: number
    orderBy: string
}) => {
    const queryParameters: string[] = []
    queryParameters.push(
        ...(played !== undefined ? [`played: ${boolToString(played)}`] : [])
    )
    queryParameters.push(
        ...(perfect !== undefined ? [`perfect: ${boolToString(perfect)}`] : [])
    )
    queryParameters.push(
        ...(started !== undefined ? [`started: ${boolToString(started)}`] : [])
    )
    queryParameters.push(
        ...(unlockedAchievements !== undefined
            ? [`unlockedAchievements: ${boolToString(unlockedAchievements)}`]
            : [])
    )

    queryParameters.push(...(limit !== undefined ? [`limit: ${limit}`] : []))
    queryParameters.push(
        ...(orderBy !== undefined ? [`orderBy: "${orderBy}"`] : [])
    )

    const { loading, error, data, trigger } = useQuery<
        PlayerOwnedGameResponse,
        OwnedGame[]
    >(
        () => gql`
        playerGames(
            id: ${player}
            ${queryParameters.join("\n")}
        ) {
            edges {
                node {
                    id
                    name
                    imgIconUrl
                    lastPlayed
                    difficultyPercentage
                    completionPercentage
                    completed
                    achievementCount
                    unlockedAchievementCount
                }
            }
        }
`,
        (response) => response.playerGames.edges?.map((node) => node.node)
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

interface PlayerRecentResponse extends BaseQueryResponse {
    playerGames: {
        edges: { node: RecentGame }[]
    }
    playerAchievements: {
        edges: { node: RecentAchievement }[]
    }
}

interface RecentGamesAndAchievements {
    games: RecentGame[]
    achievements: RecentAchievement[]
}

export const useQueryPlayerRecent = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerRecentResponse,
        RecentGamesAndAchievements
    >(
        (player: string) => [
            gqlDocument.recentGames(player),
            gqlDocument.recentAchievements(player, true, 6),
        ],
        (response) => ({
            games: response.playerGames.edges.map((edge) => edge.node),
            achievements: response.playerAchievements.edges.map(
                (edge) => edge.node
            ),
        })
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerAchievements = ({
    player,
    unlocked,
    limit = 12,
}: {
    player: string
    unlocked: boolean
    limit?: number
}) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerAchievementsResponse,
        RecentAchievement[]
    >(
        (player) => gqlDocument.recentAchievements(player, unlocked, limit),
        (response) => response.playerAchievements.edges.map((edge) => edge.node)
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerTimeline = ({
    player,
    year,
}: {
    player: string
    year: number
}) => {
    const { loading, error, data, trigger } = useQuery<
        TimelineResponse,
        {
            perfectGames: OwnedGame[]
            achievements: RecentAchievement[]
        }
    >(
        (player) => [
            gqlDocument.timelineAchievements(player, year),
            gqlDocument.perfectGames(player, year),
        ],
        (response) => ({
            perfectGames: response.playerGames.edges.map((edge) => edge.node),
            achievements: response.playerAchievements.edges.map(
                (edge) => edge.node
            ),
        })
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [year]
    )

    return { loading, error, data }
}

export const useQueryGameAchievements = ({ game }: { game: string }) => {
    const { loading, error, data, trigger } = useQuery<
        GameAchievementsResponse,
        Achievement[]
    >(
        (game) => gqlDocument.gameAchievements(game),
        (response) => response.gameAchievements
    )

    useEffect(
        () => trigger(game),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [game]
    )

    return { loading, error, data }
}

interface PlayerGameResponse extends BaseQueryResponse {
    game: Game
    gameAchievements: Achievement[]
    playerGame: OwnedGame
    playerAchievementsForGame: RecentAchievement[]
}

// TODO maybe update PlayerOwnedGame to return game?
export const useQueryPlayerGame = ({
    player,
    game,
}: {
    player: string
    game: string
}) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerGameResponse,
        {
            game: Game
            achievements: Achievement[]
            playerGame: OwnedGame
            playerAchievements: RecentAchievement[]
        }
    >(
        (player, game) => [
            gql`
game(id: ${game}) {
    id
    name
    imgIconUrl
    difficultyPercentage
}
gameAchievements(id: ${game}) {
    name
    displayName
    description
    iconUrl
    iconGrayUrl
    globalPercentage
}
playerGame(id: ${player}, gameId: ${game}) {
    lastPlayed
    playtimeForever
    completed
  }
playerAchievementsForGame(
    id: ${player}
    gameId: ${game}
) {
    id
    unlocked
}
            `,
        ],
        (response) => ({
            game: response.game,
            achievements: response.gameAchievements,
            playerGame: response.playerGame,
            playerAchievements: response.playerAchievementsForGame,
        })
    )

    useEffect(
        () => trigger(player, game),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [player, game]
    )

    return { loading, error, data }
}

export const useQueryGameOwners = ({ game }: { game: string }) => {
    const { loading, error, data, trigger } = useQuery<
        PlayersResponse,
        Player[]
    >(
        (game) => gqlDocument.gameOwners(game),
        (response) => response.players
    )

    useEffect(
        () => trigger(game),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [game]
    )

    return { loading, error, data }
}
