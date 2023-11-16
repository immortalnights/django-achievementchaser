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
