import { useMemo } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import BorderedImage from "./BorderedImage"
import { Box, Tooltip, Typography } from "@mui/material"
import { getRelativeTime } from "../utilities"
import dayjs from "dayjs"
import OwnedGame from "./OwnedGame"

interface GameAchievementIndex {
    [key: string]: GameAchievements
}

interface GameAchievements {
    id: number
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

    const getAchievementIcon = (
        achievement: Omit<RecentAchievement, "game">
    ) => (achievement.unlocked ? achievement.iconUrl : achievement.iconGrayUrl)

    const AchievementTitle = ({
        achievement,
    }: {
        achievement: Omit<RecentAchievement, "game">
    }) => {
        let subTitle: string | undefined
        if (achievement.unlocked) {
            const unlockedDate = dayjs(achievement.unlocked)
            subTitle = `Unlocked: ${unlockedDate.format(
                "MMM D, YYYY"
            )} (${getRelativeTime(unlockedDate)})`
        } else if (achievement.globalPercentage) {
            subTitle = `Difficulty: ${achievement.globalPercentage.toFixed(2)}%`
        }

        return (
            <>
                <Typography>{achievement.displayName}</Typography>
                {subTitle && (
                    <Typography fontSize="small">{subTitle}</Typography>
                )}
            </>
        )
    }

    return (
        <>
            <Box>
                <OwnedGame player={player} game={game} />
            </Box>
            {game.achievements.map((achievement) => (
                <Tooltip
                    title={<AchievementTitle achievement={achievement} />}
                    arrow
                >
                    <div
                        key={`${game.id}-${achievement.id}`}
                        title={getAchievementTitle(achievement)}
                    >
                        <BorderedImage
                            src={getAchievementIcon(achievement)}
                            style={{
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>
                </Tooltip>
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
