import PlayerSettingsContext from "@/context/PlayerSettingsContext"
import { useQuery } from "graphql-hooks"
import { useContext, useEffect, useMemo } from "react"
import { playerPerfectGames, playerUnlockedAchievements } from "./documents"

export const unwrapEdges = <T>(connection: Connection<T> | undefined) =>
    connection ? connection.edges.map((edge) => edge.node) : []

export const updateUnlockedAchievementData = (
    prevData: PlayerQueryResponse,
    data: PlayerQueryResponse
) => {
    const prevEdge = prevData.player?.unlockedAchievements?.edges ?? []
    const respEdge = data.player?.unlockedAchievements?.edges ?? []
    const edges = [...prevEdge, ...respEdge]

    return {
        player: {
            ...prevData.player,
            unlockedAchievements: {
                pageInfo: data.player?.unlockedAchievements?.pageInfo,
                edges,
            },
        },
    }
}

export const updatePerfectGameData = (
    prevData: PlayerQueryResponse,
    data: PlayerQueryResponse
) => {
    const prevEdge = prevData.player?.games?.edges ?? []
    const respEdge = data.player?.games?.edges ?? []
    const edges = [...prevEdge, ...respEdge]

    return {
        player: {
            ...prevData.player,
            games: {
                pageInfo: data.player?.games?.pageInfo,
                edges,
            },
        },
    }
}

export const useLoadPlayerAchievements = (variables: {
    player: string
    game?: number
    year?: number
    orderBy?: string
}) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { data: response, refetch } = useQuery<PlayerQueryResponse>(
        playerUnlockedAchievements,
        { variables, limit: 100 }
    )

    useEffect(() => {
        const unlockedAchievements = response?.player?.unlockedAchievements
        if (!response || unlockedAchievements?.pageInfo?.hasNextPage) {
            refetch({
                variables: {
                    ...variables,
                    limit: 100,
                    cursor: unlockedAchievements?.pageInfo?.endCursor ?? "",
                },
                updateData: updateUnlockedAchievementData,
            }).catch(() => console.error("Refetch failed"))
        }
    }, [variables, response, refetch])

    return unwrapEdges(response?.player?.unlockedAchievements)
}

export const useLoadPlayerPerfectGames = (variables: {
    player: string
    year?: number
    orderBy?: string
}) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { data: response, refetch } = useQuery<PlayerQueryResponse>(
        playerPerfectGames,
        { ...variables, limit: 100 }
    )

    useEffect(() => {
        const perfectGames = response?.player?.games
        if (!response || perfectGames?.pageInfo?.hasNextPage) {
            refetch({
                variables: {
                    ...variables,
                    limit: 100,
                    cursor: perfectGames?.pageInfo?.endCursor ?? "",
                },
                updateData: updatePerfectGameData,
            }).catch(() => console.error("Refetch failed"))
        }
    }, [variables, response, refetch])

    return unwrapEdges(response?.player?.games)
}

export const useAchievementFilter = (
    achievements: Achievement[],
    playerAchievements: PlayerUnlockedAchievement[]
) => {
    const { achievementSortOrder, hideUnlockedAchievements } = useContext(
        PlayerSettingsContext
    )

    return useMemo(() => {
        const playerAchievementReferenceSort = (
            a: Achievement,
            b: Achievement
        ) => {
            const aIndex = playerAchievements.findIndex(
                (item) => item.achievement.id === a.id
            )
            const bIndex = playerAchievements.findIndex(
                (item) => item.achievement.id === b.id
            )

            return aIndex === -1 || bIndex === -1 ? 1 : aIndex - bIndex
        }

        const filterUnlockedAchievements = () => {
            return achievements.filter(
                (achievement) =>
                    !playerAchievements.find(
                        (playerAchievement) =>
                            playerAchievement.achievement.id === achievement.id
                    )
            )
        }

        let mutatedAchievements
        if (hideUnlockedAchievements) {
            mutatedAchievements = filterUnlockedAchievements()
        } else if (achievementSortOrder === "unlocked") {
            // Array is modified in place
            mutatedAchievements = achievements
                .slice()
                .sort(playerAchievementReferenceSort)
        } else {
            mutatedAchievements = achievements
        }

        return mutatedAchievements
    }, [
        achievements,
        playerAchievements,
        achievementSortOrder,
        hideUnlockedAchievements,
    ])
}
