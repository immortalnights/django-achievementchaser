import { useMemo } from "react"
import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import FlexUnorderedList from "./FlexUnorderedList"
import { Box } from "@mui/material"

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

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "space-between",
            }}
        >
            {Object.entries(groupedAchievements).map(([id, item]) => (
                <div style={{ maxWidth: 220, textAlign: "center" }} key={id}>
                    <Link
                        to={`/player/${player}/game/${item.id}`}
                        title={item.name}
                    >
                        <BorderedImage
                            src={`https://media.steampowered.com/steam/apps/${item.id}/capsule_184x69.jpg`}
                        />
                    </Link>
                    <FlexUnorderedList justifyContent="center" wrap>
                        {item.achievements.map((achievement) => (
                            <li
                                key={`${achievement.game?.name}-${achievement.name}`}
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
                </div>
            ))}
        </Box>
    )
}

export default EasiestGameAchievementsList
