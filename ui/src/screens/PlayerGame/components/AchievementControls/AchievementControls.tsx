import { useContext, useMemo } from "react"
import { Box } from "@mui/material"
import { unwrapEdges } from "@/api/utils"
import {
    ClearComparisonButton,
    HideUnlockedAchievementsButton,
    OrderAchievementsButton,
    PlayerSelect,
} from "@/components/controls"
import PlayerCompareContext from "../../context/PlayerCompareContext"

const AchievementControls = ({
    game,
    owner,
}: {
    game: Game
    owner: Omit<PlayerOwnedGame, "game">
}) => {
    const { otherPlayer, setOtherPlayer } = useContext(PlayerCompareContext)

    const players = useMemo(
        () =>
            unwrapEdges(game.owners)
                .map((owner) => owner.player)
                .filter(
                    (player) => player && owner?.player?.id !== player.id
                ) as Player[],
        [game, owner]
    )

    return (
        <Box>
            {!otherPlayer && (
                <PlayerSelect
                    options={players}
                    value={otherPlayer}
                    onChange={setOtherPlayer}
                />
            )}

            {otherPlayer && <ClearComparisonButton />}
            <HideUnlockedAchievementsButton />
            <OrderAchievementsButton />
        </Box>
    )
}

export default AchievementControls
