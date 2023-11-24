import { Box, Grid, Typography } from "@mui/material"
import BorderedImage from "./BorderedImage"
import GameOwners from "./GameOwners"
import GameTitle from "./GameTitle"

const GameHeader = ({ game }: { game: Game }) => {
    return (
        <>
            <GameTitle game={game} variant="h4" />
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
