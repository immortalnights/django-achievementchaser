import { Typography } from "@mui/material"
import Loader from "./Loader"

const AchievementItem = ({
    displayName,
    description,
    iconUrl,
    globalPercentage,
}: Achievement) => {
    const startGradient = Math.floor(globalPercentage ?? 0)
    const endGradient = 100 - startGradient
    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <img src={iconUrl} style={{ width: 64, height: 64 }} />
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    border: "1px solid white",
                    borderRadius: 5,
                    marginLeft: "0.5em",
                }}
            >
                <div
                    style={{
                        flexGrow: 1,
                        textAlign: "left",
                        position: "relative",
                        background: `linear-gradient(to right, #ccc ${startGradient}%, transparent ${
                            100 - endGradient
                        }%)`,
                        border: "1px solid darkgray",
                    }}
                >
                    <div style={{ padding: "0.1em 0 0.1em 0.5em" }}>
                        <Typography variant="h6">{displayName}</Typography>
                        <Typography>{description}</Typography>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        width: "4em",
                    }}
                >
                    <div style={{ margin: "auto" }}>
                        {globalPercentage?.toFixed(2)}%
                    </div>
                </div>
            </div>
        </li>
    )
}

const GameAchievements = ({ game }: { game: Game }) => {
    return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {game.achievements?.length &&
                game.achievements.map((achievement) => (
                    <AchievementItem key={achievement.name} {...achievement} />
                ))}
        </ul>
    )
}

export default GameAchievements
