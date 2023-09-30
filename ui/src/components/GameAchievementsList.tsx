import { useMemo } from "react"
import { Link } from "react-router-dom"
import Grid from "@mui/material/Unstable_Grid2"
import BorderedImage from "./BorderedImage"
import { Box } from "@mui/material"
import { getRelativeTime } from "../utilities"
import dayjs from "dayjs"

interface GameAchievementIndex {
    [key: string]: GameAchievements
}

interface GameAchievements {
    id: string
    name: string
    achievements: Omit<RecentAchievement, "game">[]
}

const GameAchievementSet = ({
    player,
    game,
}: {
    player: string
    game: GameAchievements
}) => {
    const getAchievementTitle = (
        achievement: Omit<RecentAchievement, "game">
    ) => {
        let title = achievement.displayName
        if (achievement.unlocked) {
            const unlockedDate = dayjs(achievement.unlocked)
            title += ` - ${unlockedDate.format(
                "MMM D, YYYY"
            )} (${getRelativeTime(unlockedDate)})`
        } else {
            title += ` - ${achievement.globalPercentage.toFixed(2)}%`
        }
        return title
    }

    return (
        <>
            <Box>
                <Link
                    to={`/game/${game.id}?player=${player}`}
                    title={game.name}
                >
                    <BorderedImage
                        src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                    />
                </Link>
            </Box>
            {game.achievements.map((achievement) => (
                <div
                    key={`${game.id}-${achievement.id}`}
                    title={getAchievementTitle(achievement)}
                >
                    <BorderedImage
                        src={achievement.iconGrayUrl}
                        style={{
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>
            ))}
        </>
    )
}

const groupPlayerAchievements = (achievements: RecentAchievement[]) => {
    const games: GameAchievementIndex = {}

    achievements.forEach((item) => {
        const { game, ...rest } = item

        if (game && game.id) {
            const key = String(game.id as keyof typeof games)
            if (!games[key]) {
                games[key] = {
                    ...game,
                    achievements: [],
                }
            }

            games[key].achievements.push({
                ...rest,
            })
        }
    })

    return games
}

const GameAchievementsList = ({
    player,
    achievements,
    rows,
}: {
    player: string
    achievements: RecentAchievement[]
    rows: number
}) => {
    const groupedAchievements = useMemo(
        () => groupPlayerAchievements(achievements),
        [achievements]
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
                    alignItems="center"
                    gap={1}
                    wrap="wrap"
                    key={item.id}
                    paddingBottom={0.5}
                >
                    <GameAchievementSet player={player} game={item} />
                </Grid>
            ))}
        </Grid>
    )
}

export default GameAchievementsList
