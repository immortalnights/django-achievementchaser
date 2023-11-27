import { useMemo } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import GameCapsule from "./GameCapsule"
import AchievementIcon from "./AchievementIcon"
import { Stack } from "@mui/material"

type MaybeUnlockedAchievement = {
    datetime?: string
} & Achievement

interface GameAchievements {
    game: Game
    achievements: MaybeUnlockedAchievement[]
}

interface GameAchievementIndex {
    [key: string]: GameAchievements
}

const GameAchievementSet = ({
    player,
    game,
    achievements,
}: {
    player: string
    game: Game
    achievements: MaybeUnlockedAchievement[]
}) => {
    return (
        <>
            <GameCapsule player={player} game={game} />
            <Stack flexDirection="row" flexWrap="wrap" gap={1}>
                {achievements.map((item) => (
                    <AchievementIcon
                        key={`${game.id}-${item.id}`}
                        game={game.id}
                        achievement={item}
                        unlockedDatetime={item.datetime}
                    />
                ))}
            </Stack>
        </>
    )
}

const groupAchievements = (
    achievements: Achievement[] | PlayerUnlockedAchievement[],
    maxAchievements?: number
) => {
    const games: GameAchievementIndex = {}

    achievements.forEach((item) => {
        const { game, ...rest } = item

        if (game && game.id) {
            const key = String(game.id as keyof typeof games)
            if (!games[key]) {
                games[key] = {
                    game,
                    achievements: [],
                }
            }

            if (
                maxAchievements === undefined ||
                games[key].achievements.length < maxAchievements
            ) {
                if ("datetime" in item) {
                    games[key].achievements.push({
                        datetime: item.datetime,
                        ...item.achievement,
                    })
                } else if ("displayName" in item) {
                    games[key].achievements.push({
                        datetime: undefined,
                        ...(rest as Achievement),
                    })
                }
            }
        }
    })

    return games
}

const GameGroupedAchievements = ({
    player,
    achievements,
    rows,
    maxAchievements,
}: {
    player: string
    achievements: Achievement[] | PlayerUnlockedAchievement[]
    rows: number
    maxAchievements?: number
}) => {
    const groupedAchievements = useMemo(
        () => groupAchievements(achievements, maxAchievements),
        [achievements, maxAchievements]
    )

    return (
        <Grid container>
            {Object.entries(groupedAchievements).map(([_, item]) => (
                <Grid
                    xs={12}
                    sm={6}
                    md={12 / rows}
                    lg={12 / rows}
                    display="flex"
                    alignItems="flex-start"
                    gap={1}
                    wrap="wrap"
                    key={item.game.id}
                    paddingBottom={1}
                >
                    <GameAchievementSet
                        key={item.game.id}
                        player={player}
                        {...item}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default GameGroupedAchievements
