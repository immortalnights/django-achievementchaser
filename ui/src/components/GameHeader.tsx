import { Box, Stack, Typography } from "@mui/material"
import BorderedImage from "./BorderedImage"
import GameOwners from "./GameOwnersTable"
import GameTitle from "./GameTitle"
import GameDifficulty from "./GameDifficulty"

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
                        <GameDifficulty
                            difficulty={game.difficultyPercentage}
                        />
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
