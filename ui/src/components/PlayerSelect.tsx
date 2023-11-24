import {
    SelectChangeEvent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"
import { useQuery } from "graphql-hooks"
import { useContext } from "react"
import { players as playersDocument } from "../api/documents"
import PlayerCompareContext from "../context/PlayerCompareContext"

const PlayerSelect = ({
    filterPlayers,
    filterGames,
    value,
}: {
    filterPlayers: string[]
    filterGames: string[]
    value?: string
}) => {
    // TODO add game filter
    console.debug(filterGames)
    const { data, loading } = useQuery<PlayersQueryResponse>(playersDocument)
    const { setOtherPlayer } = useContext(PlayerCompareContext)

    const handleChange = (event: SelectChangeEvent<string>) => {
        setOtherPlayer(event.target.value)
    }

    let players: Player[] = []
    if (data) {
        players = data.players.filter(
            (player) => !filterPlayers.includes(player.id)
        )
    }

    return (
        <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="select-player-compare-label">Compare</InputLabel>
            <Select
                labelId="select-player-compare-label"
                fullWidth
                value={(data && value) ?? ""}
                label="Compare"
                size="small"
                onChange={handleChange}
                disabled={loading}
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
