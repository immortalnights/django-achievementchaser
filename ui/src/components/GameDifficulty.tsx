import { Typography } from "@mui/material"

const GameDifficulty = ({ difficulty }: { difficulty?: number }) =>
    difficulty !== undefined && (
        <div style={{ minWidth: "85px" }}>
            <Typography variant="subtitle1" textTransform="uppercase">
                Difficulty
            </Typography>
            {difficulty.toFixed(2)}%
        </div>
    )

export default GameDifficulty
