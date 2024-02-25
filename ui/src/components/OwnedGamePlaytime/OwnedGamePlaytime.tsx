import { Typography } from "@mui/material"
import { duration } from "@/dayjsUtilities"

const OwnedGamePlaytime = ({ playtimeForever }: GameOwner) => {
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
