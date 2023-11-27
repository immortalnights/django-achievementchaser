import { Box } from "@mui/material"

const NoAchievementsBanner = ({
    title = "No Achievements",
}: {
    title?: string
}) => (
    <Box
        flexGrow={1}
        marginTop={0}
        padding={2}
        textAlign="center"
        minHeight={10}
        sx={{ backgroundColor: "lightgray" }}
    >
        {title}
    </Box>
)

export default NoAchievementsBanner
