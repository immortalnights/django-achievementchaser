import { Star } from "@mui/icons-material"
import {
    Box,
    CircularProgress,
    CircularProgressProps,
    Typography,
} from "@mui/material"

// from https://mui.com/material-ui/react-progress/#circular-with-label
const CircularProgressWithLabel = (
    props: CircularProgressProps & { value: number }
) => {
    return (
        <Box margin="auto">
            <Box
                sx={{
                    position: "relative",
                    display: "inline-flex",
                }}
            >
                <CircularProgress
                    sx={{ position: "absolute", color: "lightgray" }}
                    variant="determinate"
                    value={100}
                />
                <CircularProgress variant="determinate" {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {props.value === 100 ? (
                        <Star htmlColor="gold" />
                    ) : (
                        <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                        >{`${Math.floor(props.value)}%`}</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default CircularProgressWithLabel
