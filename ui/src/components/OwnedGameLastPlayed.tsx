import { Typography } from "@mui/material"
import { formatDate, getRelativeTime } from "../utilities"

const OwnedGameLastPlayed = ({ lastPlayed }: PlayerOwnedGame) => (
    <div>
        <Typography variant="subtitle1" textTransform="uppercase">
            Last Played
        </Typography>
        {lastPlayed ? (
            <div title={formatDate(lastPlayed)}>
                {getRelativeTime(lastPlayed)}
            </div>
        ) : (
            <div>Never</div>
        )}
    </div>
)

export default OwnedGameLastPlayed
