import { DateRangeTwoTone } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useContext } from "react"
import PlayerSettingsContext from "../context/PlayerSettingsContext"

const OrderAchievementsButton = () => {
    const {
        achievementSortOrder,
        setAchievementSortOrder,
        hideUnlockedAchievements,
    } = useContext(PlayerSettingsContext)

    const orderByDifficulty = achievementSortOrder === "difficulty"

    return (
        <IconButton
            title={
                orderByDifficulty ? "Order by Difficulty" : "Order by Unlocked"
            }
            disabled={hideUnlockedAchievements}
            color={orderByDifficulty ? "inherit" : "primary"}
            onClick={() =>
                setAchievementSortOrder(
                    orderByDifficulty ? "unlocked" : "difficulty"
                )
            }
        >
            <DateRangeTwoTone />
        </IconButton>
    )
}

export default OrderAchievementsButton
