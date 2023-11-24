import { Typography } from "@mui/material"
import { duration } from "../utilities"

const OwnedGamePlaytime = ({ playtimeForever }: PlayerOwnedGame) => {
    const value = playtimeForever
        ? `${duration(playtimeForever).asHours().toFixed(1)} hours`
        : "None"

    return (
        <div>
            <Typography variant="subtitle1" textTransform="uppercase">
                Play Time
            </Typography>
            <div>{value}</div>
        </div>
    )
}

export default OwnedGamePlaytime
