import { Typography } from "@mui/material"
import { formatDate, getRelativeTime } from "@/dayjsUtilities"

const OwnedGameLastPlayed = ({ lastPlayed }: Omit<PlayerOwnedGame, "game">) => (
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
