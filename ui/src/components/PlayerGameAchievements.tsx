import { useContext, useEffect, useMemo } from "react"
import GameAchievements from "./GameAchievements"
import PlayerSettingsContext from "@/context/PlayerSettingsContext"
import { Alert } from "@mui/material"
import { useQuery } from "graphql-hooks"
import { playerUnlockedAchievements } from "@/api/documents"
import { unwrapEdges, updateUnlockedAchievementData } from "@/api/utils"

type GameWithAchievements = Required<Pick<Game, "achievements">> & Game

const useAchievementFilter = (
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

const useLoadPlayerAchievements = (variables: {
    player: string
    game?: number
    year?: number
    orderBy?: string
    limit: number
}) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { data: unlockedAchievementResponse, refetch } =
        useQuery<PlayerQueryResponse>(playerUnlockedAchievements, { variables })

    useEffect(() => {
        const unlockedAchievements =
            unlockedAchievementResponse?.player?.unlockedAchievements
        if (
            !unlockedAchievementResponse ||
            unlockedAchievements?.pageInfo?.hasNextPage
        ) {
            refetch({
                variables: {
                    ...variables,
                    cursor: unlockedAchievements?.pageInfo?.endCursor ?? "",
                },
                updateData: updateUnlockedAchievementData,
            }).catch(() => console.error("Refetch failed"))
        }
    }, [variables, unlockedAchievementResponse, refetch])

    return unwrapEdges(
        unlockedAchievementResponse?.player?.unlockedAchievements
    )
}

const PlayerGameAchievements2 = ({
    game,
    player1,
}: {
    game: GameWithAchievements
    player1?: Player
}) => {
    const player1Achievements = useLoadPlayerAchievements({
        player: player1?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
        limit: 100,
    })

    const mutatedAchievements = useAchievementFilter(
        game.achievements,
        player1Achievements ?? []
    )

    let content
    if (mutatedAchievements.length === 0) {
        content = (
            <Alert variant="outlined" severity="success" sx={{ marginTop: 1 }}>
                All achievements have been completed
            </Alert>
        )
    } else {
        content = (
            <GameAchievements
                achievements={mutatedAchievements}
                player1Achievements={player1Achievements}
            />
        )
    }
    return content
}

const CompareGameAchievements = ({
    game,
    player1,
    player2,
}: {
    game: GameWithAchievements
    player1?: Player
    player2?: Player
}) => {
    const player1Achievements = useLoadPlayerAchievements({
        player: player1?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
        limit: 100,
    })

    const player2Achievements = useLoadPlayerAchievements({
        player: player2?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
        limit: 100,
    })

    const mutatedAchievements = useAchievementFilter(
        game.achievements,
        player1Achievements ?? []
    )

    return (
        <GameAchievements
            achievements={mutatedAchievements}
            player1Achievements={player1Achievements}
            player2Achievements={player2Achievements}
        />
    )
}

const PlayerGameAchievements2X = ({
    game,
    player1,
    player2,
}: {
    game: GameWithAchievements
    player1?: Player
    player2?: Player
}) => {
    let content
    if (player1 && player2) {
        console.log("compare", player1, player2)
        content = (
            <CompareGameAchievements
                game={game}
                player1={player1}
                player2={player2}
            />
        )
    } else if (player1) {
        console.log("display", player1)
        content = <PlayerGameAchievements2 game={game} player1={player1} />
    } else {
        console.log("basic")
        content = <GameAchievements achievements={game.achievements ?? []} />
    }

    return content
}

const PlayerGameAchievements = ({
    game,
    player1,
    player2,
}: {
    game?: Game
    player1?: Player
    player2?: Player
}) => {
    let content

    if (game && game.achievements) {
        const gameWithAchievements: GameWithAchievements = {
            ...game,
            achievements: game.achievements ?? [],
        }

        content = (
            <PlayerGameAchievements2X
                game={gameWithAchievements}
                player1={player1}
                player2={player2}
            />
        )
    } else {
        content = (
            <Alert severity="info" sx={{ marginTop: 1 }}>
                No Achievements
            </Alert>
        )
    }
    return content
}

export default PlayerGameAchievements
