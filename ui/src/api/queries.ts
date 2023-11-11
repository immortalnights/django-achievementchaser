import { useEffect } from "react"
import { gql } from "graphql-request"
import gqlDocument, {
    PlayerAchievementsQueryParameters,
    PlayerGamesQueryParameters,
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
        PlayerOwnedGameResponse,
        PlayerOwnedGame[]
    >(
        () => gqlDocument.playerGamesDocument(params),
        (response) =>
            response.player.games?.edges.map((node) => node.node) ?? []
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const userQueryPlayerGame = (params: {
    player: string
    game: string
}) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerOwnedGameResponse,
        PlayerOwnedGame[]
    >(
        () => gqlDocument.playerGameDocument(params),
        (response) =>
            response.player.games?.edges.map((node) => node.node) ?? []
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerAchievements = (
    params: PlayerAchievementsQueryParameters
) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerAchievementsResponse,
        RecentAchievement[]
    >(
        () => gqlDocument.playerAchievementsDocument(params),
        (response) => response.playerAchievements.edges.map((edge) => edge.node)
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
            gqlDocument.playerAchievementsDocument({
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
            gqlDocument.playerAchievementsDocument({ player, year }),
            gqlDocument.playerGamesDocument({ player, completed: true, year }),
        ],
        (response) => ({
            // perfectGames: response.playerGames.edges.map((edge) => edge.node),
            perfectGames: [],
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

// interface PlayerGameResponse extends BaseQueryResponse {
//     game: Game
//     playerGame: OwnedGame
//     playerAchievementsForGame: RecentAchievement[]
// }

// // TODO maybe update PlayerOwnedGame to return game?
// export const useQueryPlayerGame = ({
//     player,
//     game,
// }: {
//     player: string
//     game: string
// }) => {
//     const { loading, error, data, trigger } = useQuery<
//         PlayerGameResponse,
//         {
//             game: Game
//             playerGame: OwnedGame
//             playerAchievements: RecentAchievement[]
//         }
//     >(
//         (player, game) => [
//             gql`
// game(id: ${game}) {
//     id
//     name
//     imgIconUrl
//     difficultyPercentage
//     achievements {
//         id
//         displayName
//         description
//         iconUrl
//         iconGrayUrl
//         globalPercentage
//     }
// }
// playerGame(id: ${player}, gameId: ${game}) {
//     lastPlayed
//     playtimeForever
//     completed
//   }
// playerAchievementsForGame(
//     id: ${player}
//     gameId: ${game}
// ) {
//     id
//     unlocked
// }
//             `,
//         ],
//         (response) => ({
//             game: response.game,
//             playerGame: response.playerGame,
//             playerAchievements: response.playerAchievementsForGame,
//         })
//     )

//     useEffect(
//         () => trigger(player, game),
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [player, game]
//     )

//     return { loading, error, data }
// }
