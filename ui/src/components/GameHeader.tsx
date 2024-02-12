import { Box, Stack, Typography } from "@mui/material"
import BorderedImage from "./BorderedImage"
import GameOwners from "./GameOwners"
import GameTitle from "./GameTitle"

const GameHeader = ({ game }: { game: Game }) => {
    return (
        <>
            <GameTitle game={game} variant="h4" />
            <Stack direction="row" useFlexGap spacing={2}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${game.id}/header.jpg`}
                />
                <Stack flexGrow={1}>
                    <Stack
                        direction="row"
                        useFlexGap
                        spacing={3}
                        borderBottom="1px solid lightgray"
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                textTransform="uppercase"
                            >
                                Difficulty
                            </Typography>
                            <Typography variant="body1">
                                {`${game.difficultyPercentage}%`}
                            </Typography>
                        </Box>
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
                    </Stack>
                    <GameOwners game={game} />
                </Stack>
            </Stack>
        </>
    )
}

export default GameHeader
