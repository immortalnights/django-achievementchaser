import { Box } from "@mui/material"
import Link from "./Link"
import ExternalLink from "./ExternalLink"

const GameTitle = ({ id, name }: Game) => (
    <Box
        sx={{
            display: "flex",
            margin: 0,
            alignItems: "flex-end",
            gap: 1,
        }}
    >
        <Link to={`/Game/${id}`} variant="h5">
            {name}
        </Link>
        <ExternalLink
            href={`http://store.steampowered.com/app/${id}`}
            title="Steam Game"
        />
    </Box>
)

export default GameTitle
