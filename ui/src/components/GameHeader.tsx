import { Box, Grid, Typography } from "@mui/material"
import BorderedImage from "./BorderedImage"
import ExternalLink from "./ExternalLink"
import Link from "./Link"
import GameOwners from "./GameOwners"

const GameHeader = ({ game }: { game: Game }) => {
    return (
        <>
            <Box sx={{ display: "flex", marginBottom: "0.25em" }}>
                <Link to={`/game/${game.id}`}>{game.name}</Link>
                <Box
                    sx={{
                        display: "flex",
                        paddingX: 1,
                        alignItems: "flex-end",
                    }}
                >
                    <ExternalLink
                        href={`https://store.steampowered.com/app/${
                            game.id
                        }/${encodeURIComponent(game.name ?? "")}`}
                        title="Steam Profile"
                    />
                </Box>
            </Box>
            <Grid container>
                <Grid paddingRight="1em">
                    <BorderedImage
                        src={`https://media.steampowered.com/steam/apps/${game.id}/header.jpg`}
                    />
                </Grid>
                <Grid flexGrow={1}>
                    <Box
                        display="flex"
                        gap={2}
                        borderBottom="1px solid lightgray"
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                textTransform="uppercase"
                            >
                                Achievements
                            </Typography>
                            <Typography variant="body1">
                                {game.achievementCount ?? "?"}
                            </Typography>
                        </Box>
                    </Box>
                    <GameOwners game={game} />
                </Grid>
            </Grid>
        </>
    )
}

export default GameHeader
