import { useMemo } from "react"
import { Link } from "react-router-dom"
import Grid from "@mui/material/Unstable_Grid2"
import BorderedImage from "./BorderedImage"
import { Box } from "@mui/material"

const EasiestGameAchievementsList = ({
    player,
    achievements,
}: {
    player: string
    achievements: RecentAchievement[]
}) => {
    const groupedAchievements = useMemo(() => {
        const games: {
            [key: string]: {
                id: string
                name: string
                achievements: Omit<RecentAchievement, "game">[]
            }
        } = {}

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
    }, [achievements])

    return (
        <Grid container>
            {Object.entries(groupedAchievements).map(([_, item]) => (
                <Grid
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    wrap="wrap"
                    key={item.id}
                >
                    <Box>
                        <Link
                            to={`/player/${player}/game/${item.id}`}
                            title={item.name}
                        >
                            <BorderedImage
                                src={`https://media.steampowered.com/steam/apps/${item.id}/capsule_184x69.jpg`}
                            />
                        </Link>
                    </Box>
                    {item.achievements.map((achievement) => (
                        <div
                            key={`${item.id}-${achievement.id}`}
                            title={`${
                                achievement.displayName
                            } - ${achievement.globalPercentage.toFixed(2)}%`}
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
                </Grid>
            ))}
        </Grid>
    )
}

export default EasiestGameAchievementsList
