import { useEffect } from "react"
import { gql } from "graphql-request"
import gqlDocument from "./graphql-documents"
import { useQuery } from "./base-query"

const boolToString = (bool: boolean) => (bool ? "true" : "false")

export const useLazyQueryPlayers = () => {
    return useQuery<PlayerQueryResponse, Player>(
        (player: string) => gql`{
        player(name: "${player}") {
    id
  }
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
    limit: number
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
                    gameId
                    name
                    imgUrl
                    difficultyPercentage
                    completionPercentage
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

interface PlayerRecentResponse {
    playerGames: {
        nodes: {
            gameId: string
            name: string
            imgUrl: string
            difficultyPercentage: number
            completionPercentage: number
        }
    }[]
    playerAchievements: {
        nodes: {
            displayName: string
            id: string
            unlocked: string
        }
    }[]
}

export const useQueryPlayerRecent = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerRecentResponse,
        Achievement[]
    >(
        (player: string) => [
            gqlDocument.recentGames(player),
            gqlDocument.recentAchievements(player),
        ],
        (response) => {
            return {
                games: response.playerGames.edges.map((node) => node.node),
                achievements: response.playerAchievements.edges.map(
                    (node) => node.node
                ),
            }
        }
    )

    useEffect(
        () => trigger(player),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}

export const useQueryPlayerAchievements = ({ player }: { player: string }) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerAchievementsResponse,
        Achievement[]
    >(
        () => gql`
        {
            achievements(id: ${player}, ignoreUnlocked: true, limit: 12 ) {
              id
              achievements {
                name
                displayName
                iconUrl
                iconGrayUrl
                globalPercentage
                game {
                  id
                  name
                }
              }
            }
          }

`,
        (response) => response.achievements.achievements
    )

    useEffect(
        () => trigger(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return { loading, error, data }
}
