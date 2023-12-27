import { Typography } from "@mui/material"

const GameDifficulty = ({ difficulty }: { difficulty?: number }) => {
    const difficultyPercent = difficulty?.toFixed(2)
    return (
        difficultyPercent && (
            <div style={{ minWidth: "85px" }}>
                <Typography variant="subtitle1" textTransform="uppercase">
                    Difficulty
                </Typography>
                {difficultyPercent}%
            </div>
        )
    )
}

export default GameDifficulty
