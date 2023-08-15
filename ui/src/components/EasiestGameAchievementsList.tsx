import { useMemo } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import BorderedImage from "./BorderedImage"
import FlexUnorderedList from "./FlexUnorderedList"

const EasiestGameAchievementsList = ({
    player,
    achievements,
}: {
    player: string
    achievements: Achievement[]
}) => {
    const groupedAchievements = useMemo(() => {
        const games: {
            [key: string]: {
                id: number
                name: string
                achievements: Achievement[]
            }
        } = {}

        achievements.forEach((item) => {
            const { game, ...rest } = item

            if (game && game.id) {
                const key = String(game.id as keyof typeof games)
                if (!games[key]) {
                    games[key] = {
                        name: "<unknown>",
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

    console.log(groupedAchievements)

    return (
        <Grid container>
            {Object.entries(groupedAchievements).map(([id, item]) => (
                <Grid
                    key={id}
                    xs={12}
                    md={6}
                    lg={4}
                    display="flex"
                    gap={1}
                    alignItems={"center"}
                >
                    <a
                        href={`/player/${player}/game/${item.id}`}
                        title={item.name}
                    >
                        <BorderedImage
                            src={`https://media.steampowered.com/steam/apps/${item.id}/capsule_184x69.jpg`}
                        />
                    </a>
                    <FlexUnorderedList>
                        {item.achievements.map((achievement) => (
                            <li
                                key={achievement.name}
                                title={`${
                                    achievement.displayName
                                } - ${achievement.globalPercentage?.toFixed(
                                    2
                                )}%`}
                            >
                                <BorderedImage
                                    src={achievement.iconUrl}
                                    style={{
                                        width: 64,
                                        height: 64,
                                    }}
                                />
                            </li>
                        ))}
                    </FlexUnorderedList>
                </Grid>
            ))}
        </Grid>
    )
}

export default EasiestGameAchievementsList
