import { useEffect } from "react"
import { gql } from "graphql-request"
import gqlDocument, {
    PlayerAvailableAchievementsQueryParameters,
    PlayerGamesQueryParameters,
    PlayerUnlockedAchievementsQueryParameters,
} from "./graphql-documents"
import { useQuery } from "./base-query"

export const unwrapEdges = <T>(connection: Connection<T> | undefined) =>
    connection ? connection.edges.map((edge) => edge.node) : []

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

export const useQueryPlayer = ({
    player,
    profile = false,
}: {
    player: string
    profile: boolean
}) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        Player
    >(
        () => gqlDocument.playerDocument({ player, profile }),
        (response) => response.player
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    return { loading, error, data }
}

export const useQueryPlayerGames = (params: PlayerGamesQueryParameters) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        PlayerOwnedGame[]
    >(
        () => gqlDocument.playerGamesDocument(params),
        (response) => unwrapEdges(response?.player?.games)
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerGame = (params: {
    player: string
    game: string
}) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        PlayerOwnedGame
    >(
        () => gqlDocument.playerGameDocument(params),
        (response) => response.player?.game
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryUnlockedPlayerAchievements = (
    params: PlayerUnlockedAchievementsQueryParameters
) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        PlayerUnlockedAchievement[]
    >(
        () => gqlDocument.playerUnlockedAchievementsDocument(params),
        (response) => unwrapEdges(response.player?.unlockedAchievements)
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}
export const useQueryPlayerAvailableAchievements = (
    params: PlayerAvailableAchievementsQueryParameters
) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        Achievement[]
    >(
        () => gqlDocument.playerAvailableAchievementsDocument(params),
        (response) => unwrapEdges(response.player?.availableAchievements)
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

interface RecentGamesAndAchievements {
    games: PlayerOwnedGame[]
    achievements: PlayerUnlockedAchievement[]
}

export const useQueryPlayerRecent = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerQueryResponse,
        RecentGamesAndAchievements
    >(
        (player: string) => [
            gqlDocument.playerGamesDocument({
                player,
                orderBy: "-lastPlayed",
                limit: 6,
            }),
            gqlDocument.playerUnlockedAchievementsDocument({
                player,
                orderBy: "-datetime",
                limit: 6,
            }),
        ],
        (response) => ({
            games: unwrapEdges(response?.player?.games),
            achievements: unwrapEdges(response?.player?.unlockedAchievements),
        })
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

interface PlayerAchievementsResponse extends BaseQueryResponse {
    playerAchievements: {
        edges: { node: PlayerUnlockedAchievement }[]
    }
}

interface TimelineResponse
    extends PlayerAchievementsResponse,
        BaseQueryResponse {
    playerGames: {
        edges: { node: PlayerOwnedGame }[]
    }
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
            perfectGames: PlayerOwnedGame[]
            achievements: PlayerUnlockedAchievement[]
        }
    >(
        (player) => [
            gqlDocument.playerUnlockedAchievementsDocument({ player, year }),
            gqlDocument.playerGamesDocument({ player, completed: true, year }),
        ],
        (response) => ({
            perfectGames: unwrapEdges(response.playerGames),
            achievements: unwrapEdges(response.playerAchievements),
        })
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [year]
    )

    return { loading, error, data }
}
