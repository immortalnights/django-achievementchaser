import { Box, TypographyVariant } from "@mui/material"
import Link from "./Link"
import ExternalLink from "./ExternalLink"

const GameTitle = ({
    game: { id, name },
    variant = "h5",
}: {
    game: Game
    variant?: TypographyVariant
}) => (
    <Box
        sx={{
            display: "flex",
            margin: "0 0 0.25em",
            alignItems: "flex-end",
            gap: 1,
        }}
    >
        <Link to={`/Game/${id}`} variant={variant}>
            {name}
        </Link>
        <ExternalLink
            href={`http://store.steampowered.com/app/${id}`}
            title="Steam Game"
        />
    </Box>
)

export default GameTitle
