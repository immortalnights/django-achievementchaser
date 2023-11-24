import { HighlightOffRounded } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useContext } from "react"
import PlayerCompareContext from "../context/PlayerCompareContext"

const ClearComparisonButton = () => {
    const { setOtherPlayer } = useContext(PlayerCompareContext)

    const handleClick = () => setOtherPlayer(undefined)

    return (
        <IconButton title="Clear comparison" onClick={handleClick}>
            <HighlightOffRounded />
        </IconButton>
    )
}

export default ClearComparisonButton
