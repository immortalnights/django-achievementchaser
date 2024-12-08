import { Stack, Typography } from "@mui/material"
import Link from "./Link"
import { getRelativeTime } from "@/dayjsUtilities"
import BorderedImage from "./BorderedImage"
import SkeletonList from "./SkeletonList"
import { useQuery } from "graphql-hooks"
import { playerGames } from "@/api/documents"
import { unwrapEdges } from "@/api/utils"

const RecentlyPlayedGame = ({
    player,
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const lastPlayed = ownedGame.lastPlayed
        ? getRelativeTime(ownedGame.lastPlayed)
        : "Never"

    const game = ownedGame.game

    if (!game || game.name === undefined || game.imgIconUrl === undefined) {
        throw Error("Owned game missing game information")
    }

    return (
        <Link to={`/Player/${player}/Game/${game.id}`}>
            <BorderedImage
                title={`${game.name} last played ${lastPlayed}`}
                src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                style={{ display: "block" }}
            />
        </Link>
    )
}

const RecentlyPlayedGames = ({ player }: { player: string }) => {
    const { data } = useQuery<PlayerQueryResponse>(playerGames, {
        variables: { player, orderBy: "-lastPlayed", limit: 6 },
    })

    const games = data && unwrapEdges(data.player?.games)

    return (
        <>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Played
            </Typography>
            <Stack
                direction="row"
                useFlexGap
                gap={1}
                justifyContent="space-between"
                alignItems="center"
            >
                {games ? (
                    games.map((ownedGame) => (
                        <RecentlyPlayedGame
                            key={ownedGame.game.id ?? ""}
                            player={player}
                            ownedGame={ownedGame}
                        />
                    ))
                ) : (
                    <SkeletonList count={6} />
                )}

                <Link to={`/Player/${player}/RecentGames`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </Stack>
        </>
    )
}

export default RecentlyPlayedGames
