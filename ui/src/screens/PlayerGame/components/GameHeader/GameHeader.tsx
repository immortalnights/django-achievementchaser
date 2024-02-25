import { Box, Stack } from "@mui/material"
import GameTitle from "@/components/GameTitle"
import GameIcon from "@/components/GameIcon"
import GameDifficulty from "@/components/GameDifficulty"
import Details from "../Details"
import {
    HideUnlockedAchievementsButton,
    OrderAchievementsButton,
    PlayerSelect,
    SearchField,
} from "@/components/controls"
import { useContext, useMemo } from "react"
import { unwrapEdges } from "@/api/utils"
import AchievementDisplayContext from "../../context/AchievementDisplayContext"
import ClearComparisonButton from "../ClearComparisonButton"

const Search = () => {
    const { filter, setFilter } = useContext(AchievementDisplayContext)

    return (
        <SearchField
            placeholder="Search"
            ariaLabel="filter achievements"
            value={filter}
            onSubmit={(value) => setFilter(value)}
            submitOnEnter={false}
        />
    )
}

const Compare = ({ game, owner }: { game: Game; owner: string }) => {
    const { otherPlayer, setOtherPlayer } = useContext(
        AchievementDisplayContext
    )

    const players = useMemo(
        () =>
            unwrapEdges(game.owners)
                .map((owner) => owner.player)
                .filter((player) => player && owner !== player.id) as Player[],
        [game, owner]
    )

    return !otherPlayer ? (
        <PlayerSelect
            options={players}
            value={otherPlayer}
            onChange={setOtherPlayer}
        />
    ) : (
        <ClearComparisonButton />
    )
}

const GameHeader = ({
    game,
    owner,
    compare = false,
}: {
    game: Game
    owner?: PlayerOwnedGameWithPlayer
    compare?: boolean
}) => {
    const gameAchievementCount = game.achievements?.length ?? 0

    const players = useMemo(
        () =>
            unwrapEdges(game.owners)
                .map((owner) => owner.player)
                .filter(
                    (player) => player && owner?.player?.id !== player.id
                ) as Player[],
        [game, owner]
    )

    const showSearch = gameAchievementCount > 0
    const canCompare = gameAchievementCount > 0 && players.length > 0 && owner

    return (
        <>
            <GameTitle game={game} />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                useFlexGap
                spacing={2}
            >
                <GameIcon {...game} />
                {gameAchievementCount > 0 && (
                    <>
                        <GameDifficulty
                            difficulty={game.difficultyPercentage}
                        />
                    </>
                )}

                {owner && !compare ? (
                    <Details game={game} owner={owner} />
                ) : (
                    <div style={{ flexGrow: 0.5 }} />
                )}

                <Box
                    display="flex"
                    flexGrow={1}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    {showSearch && <Search />}

                    {canCompare && (
                        <Compare game={game} owner={owner?.player.id} />
                    )}
                </Box>

                {gameAchievementCount > 0 && owner && (
                    <Box>
                        <HideUnlockedAchievementsButton />
                        <OrderAchievementsButton />
                    </Box>
                )}
            </Stack>
        </>
    )
}

export default GameHeader
