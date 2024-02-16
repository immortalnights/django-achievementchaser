import GameAchievements from "./GameAchievements"
import { Alert } from "@mui/material"
import { useAchievementFilter, useLoadPlayerAchievements } from "@/api/utils"

type GameWithAchievements = Required<Pick<Game, "achievements">> & Game

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
    })

    const player2Achievements = useLoadPlayerAchievements({
        player: player2?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
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
