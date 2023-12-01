import {
    SelectChangeEvent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"
import { useQuery } from "graphql-hooks"
import { useContext, useMemo } from "react"
import { gameWithOwners } from "@/api/documents"
import PlayerCompareContext from "@/context/PlayerCompareContext"
import { unwrapEdges } from "@/api/utils"

const PlayerSelect = ({
    game,
    excludePlayers,
    value,
}: {
    game: string
    excludePlayers: string[]
    value?: string
}) => {
    const { data, loading } = useQuery<GameQueryResponse>(gameWithOwners, {
        variables: {
            game: Number(game),
        },
    })
    const { setOtherPlayer } = useContext(PlayerCompareContext)

    const handleChange = (event: SelectChangeEvent<string>) => {
        setOtherPlayer(event.target.value)
    }

    const players = useMemo(
        () =>
            data
                ? (unwrapEdges(data.game?.owners)
                      .map((owner) => owner.player)
                      .filter(
                          (player) =>
                              player && !excludePlayers.includes(player.id)
                      ) as Player[]) // force the type as the filter doesn't apply correctly
                : [],
        [data, excludePlayers]
    )

    return (
        <FormControl
            sx={{ minWidth: 200 }}
            size="small"
            disabled={loading || players.length === 0}
        >
            <InputLabel id="select-player-compare-label">Compare</InputLabel>
            <Select
                labelId="select-player-compare-label"
                fullWidth
                value={(data && value) ?? ""}
                label="Compare"
                size="small"
                onChange={handleChange}
            >
                {value && (
                    <MenuItem key="noone" value="">
                        No one
                    </MenuItem>
                )}
                {players.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                        {player.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
export default PlayerSelect
