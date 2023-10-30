import { ReactNode, useContext } from "react"
import { Typography, Box, IconButton } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import BorderedImage from "./BorderedImage"
import PlayerProfileContext from "../context/ProfileContext"
import { useQueryPlayerProfileSummary } from "../api/queries"
import Loader from "./Loader"
import Timeline from "./Timeline"
import ExternalLink from "./ExternalLink"
import Link from "./Link"
import RecentActivity from "./RecentActivity"

const Playtime = ({ playtime }: { playtime: number }) => {
    const units = { minutes: 1, hrs: 60, days: 24, years: 365 }
    const keys = Object.keys(units) as unknown as keyof typeof units
    let value = playtime
    let index = 0
    for (; index < keys.length; index++) {
        const divider = units[keys[index] as keyof typeof units]
        if (value > divider) {
            value = value / divider
        } else {
            break
        }
    }

    return `${index > 1 ? value.toFixed(2) : value} ${keys[index - 1] ?? ""}`
}

const Header = ({
    id,
    name,
    url,
}: {
    id: string
    name: string
    url: string
}) => {
    const { hideGameStatistics, toggleGameStatistics } =
        useContext(PlayerProfileContext)

    return (
        <Box sx={{ display: "flex", marginBottom: "0.25em" }}>
            <Link to={`/player/${id}`}>{name}</Link>
            <Box sx={{ display: "flex", paddingX: 1, alignItems: "flex-end" }}>
                <ExternalLink href={url} title="Steam Profile" />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ fontSize: "0.75em" }}>
                <IconButton
                    title="Toggle Game Statistics"
                    onClick={toggleGameStatistics}
                >
                    {hideGameStatistics ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </Box>
        </Box>
    )
}

const MetaData = ({
    label,
    value,
    title,
    link,
}: {
    label: string
    value: ReactNode | string | number
    title?: string
    link?: string
}) => (
    <Box>
        <Typography variant="subtitle1" textTransform="uppercase">
            {label}
        </Typography>
        <Typography variant="body1" title={title}>
            {link ? (
                <Link to={link} variant="subtitle1">
                    {value}
                </Link>
            ) : (
                value
            )}
        </Typography>
    </Box>
)

interface PlayerStatisticsContentProps extends PlayerProfileSummary {
    player: string
}

const PlayerStatisticsContent = ({
    player,
    ownedGames,
    perfectGames,
    playedGames,
    totalPlaytime,
    unlockedAchievements,
    lockedAchievements,
}: PlayerStatisticsContentProps) => {
    const { hideGameStatistics } = useContext(PlayerProfileContext)

    return (
        <Grid container>
            <Grid
                lg={2}
                md={3}
                sm={4}
                xs={6}
                sx={{ display: hideGameStatistics ? "none" : "block" }}
            >
                <MetaData label="Games" value={ownedGames ?? 0} />
            </Grid>
            <Grid
                lg={2}
                md={3}
                sm={4}
                xs={6}
                sx={{ display: hideGameStatistics ? "none" : "block" }}
            >
                <MetaData
                    label="Played"
                    value={
                        ownedGames && playedGames
                            ? `${(ownedGames / playedGames).toFixed(2)}%`
                            : "-"
                    }
                    title={`${playedGames ?? 0} of ${ownedGames ?? 0}`}
                />
            </Grid>
            <Grid
                lg={2}
                md={3}
                sm={4}
                xs={6}
                sx={{ display: hideGameStatistics ? "none" : "block" }}
            >
                <MetaData
                    label="Playtime"
                    value={<Playtime playtime={totalPlaytime ?? 0} />}
                />
            </Grid>
            <Grid lg={2} md={4} sm={4} xs={6}>
                <MetaData
                    label="Perfect Games"
                    value={perfectGames}
                    title={`${(perfectGames / ownedGames).toFixed(2)}%`}
                    link={`/player/${player}/perfectgames`}
                />
            </Grid>
            <Grid lg={3} md={4} sm={6} xs={12}>
                <MetaData
                    label="Achievements Unlocked"
                    value={`${(
                        (unlockedAchievements / lockedAchievements) *
                        100
                    ).toFixed(2)}%`}
                    title={`${unlockedAchievements} of ${lockedAchievements}`}
                />
            </Grid>
        </Grid>
    )
}

const PlayerStatistics = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerProfileSummary(player)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <PlayerStatisticsContent player={player} {...data} />
            }}
        />
    )
}

const PlayerProfileHeader = ({
    id,
    name,
    avatarLargeUrl,
    profileUrl,
}: {
    id: string
    name?: string
    avatarLargeUrl?: string
    profileUrl?: string
}) => {
    return (
        <>
            <Header id={id} name={name ?? ""} url={profileUrl ?? ""} />
            <Grid container>
                <Grid
                    xs={12}
                    sm={2}
                    display={{ xs: "none", sm: "none", md: "block" }}
                    paddingRight="1em"
                >
                    <BorderedImage
                        src={avatarLargeUrl}
                        style={{
                            width: "100%",
                            maxWidth: "184px",
                            margin: "auto",
                        }}
                    />
                </Grid>
                <Grid xs={12} sm={10}>
                    <PlayerStatistics player={id} />
                    <Grid container wrap="wrap">
                        <Grid xs={6}>
                            <RecentActivity player={id} />
                        </Grid>
                        <Grid xs={6}>
                            <Timeline player={id} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default PlayerProfileHeader
