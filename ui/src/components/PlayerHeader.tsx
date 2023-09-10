import { ReactNode, useContext } from "react"
import { Typography, Box, IconButton } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import PlayerProfileContext from "../context/ProfileContext"
import {
    useQueryPlayerProfileSummary,
    useQueryPlayerRecent,
} from "../api/queries"
import Loader from "./Loader"
import Timeline from "./Timeline"

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
            {link ? <Link to={link}>{value}</Link> : value}
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
                        unlockedAchievements / lockedAchievements
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

const Header = ({ name }: { name: string }) => {
    const { hideGameStatistics, toggleGameStatistics } =
        useContext(PlayerProfileContext)

    return (
        <Box sx={{ display: "flex", marginBottom: "0.25em" }}>
            <Typography variant="h4">{name}</Typography>
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

const RecentIconsContent = ({
    player,
    recentGames,
    recentAchievements,
}: {
    player: string
    recentGames: RecentGame[]
    recentAchievements: RecentAchievement[]
}) => (
    <>
        <Typography variant="subtitle1" textTransform="uppercase">
            Recently Played
        </Typography>

        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}
        >
            {recentGames.map((game) => (
                <li key={game.id}>
                    <Link
                        to={`/player/${player}/game/${game.id}`}
                        title={game.name}
                    >
                        <BorderedImage
                            title={`Last played ${game.lastPlayed}`}
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                            style={{ display: "block" }}
                        />
                    </Link>
                </li>
            ))}
            <li>
                <Link to={`/player/${player}/recentgames`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </li>
        </ul>

        <Typography variant="subtitle1" textTransform="uppercase">
            Recently Unlocked
        </Typography>

        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}
        >
            {recentAchievements.map((item) => (
                <li
                    key={`${item.game.id}-${item.id}`}
                    style={{ paddingRight: 2 }}
                >
                    <Link
                        to={`/player/${player}/game/${item.game.id}`}
                        title={`${item.displayName} from ${item.game.name}`}
                    >
                        <BorderedImage
                            src={`${item.iconUrl}`}
                            style={{
                                width: 32,
                                height: 32,
                                display: "block",
                            }}
                        />
                    </Link>
                </li>
            ))}
            <li>
                <Link to={`/player/${player}/recentachievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </li>
        </ul>
    </>
)

const RecentIcons = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerRecent(player)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <>
                        <RecentIconsContent
                            player={player}
                            recentGames={data.games}
                            recentAchievements={data.achievements}
                        />
                    </>
                )
            }}
        />
    )
}

const PlayerProfileHeader = ({
    id,
    name,
    avatarLargeUrl,
}: {
    id: string
    name?: string
    avatarLargeUrl?: string
    profileUrl?: string
}) => {
    return (
        <>
            <Header name={name ?? ""} />
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
                            <RecentIcons player={id} />
                        </Grid>
                        <Grid xs={6}>
                            <Timeline />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default PlayerProfileHeader
