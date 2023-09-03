import { ReactNode, useContext } from "react"
import { Typography, Box, IconButton } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import GameIconList from "./GameIconList"
import AchievementIconList from "./AchievementIconList"
import PlayerProfileContext from "../context/ProfileContext"

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

const PlayerPrivateStatistics = ({
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: Pick<
    PlayerSummary,
    "totalGamesCount" | "playedGamesCount" | "totalPlaytime"
>) => {
    const { hideGameStatistics } = useContext(PlayerProfileContext)

    const displayMap = hideGameStatistics
        ? { xs: "none" }
        : {
              xs: "none",
              md: "block",
          }

    return (
        <Box display={displayMap}>
            <Grid container>
                <Grid xs={false} md={4}>
                    <MetaData label="Games" value={totalGamesCount ?? 0} />
                </Grid>
                <Grid xs={false} md={4}>
                    <MetaData
                        label="Played"
                        value={
                            totalGamesCount && playedGamesCount
                                ? `${(
                                      totalGamesCount / playedGamesCount
                                  ).toFixed(2)}%`
                                : "-"
                        }
                        title={`${playedGamesCount ?? 0} of ${
                            totalGamesCount ?? 0
                        }`}
                    />
                </Grid>
                <Grid xs={false} md={4}>
                    <MetaData
                        label="Playtime"
                        value={<Playtime playtime={totalPlaytime ?? 0} />}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

interface PlayerStatisticsProps extends PlayerSummary {
    player: string
}

const PlayerStatistics = ({
    player,
    perfectGamesCount,
    achievementsUnlockedCount,
    totalAchievementCount,
    friends,
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: PlayerStatisticsProps) => {
    return (
        <Grid container>
            <Grid xs={12}>
                <PlayerPrivateStatistics
                    totalGamesCount={totalGamesCount}
                    playedGamesCount={playedGamesCount}
                    totalPlaytime={totalPlaytime}
                />
            </Grid>
            <Grid md={4}>
                <MetaData
                    label="Perfect Games"
                    value={perfectGamesCount ?? "-"}
                    title={`${
                        perfectGamesCount && totalGamesCount
                            ? (perfectGamesCount / totalGamesCount).toFixed(2)
                            : 0
                    }%`}
                    link={`/player/${player}/perfectgames`}
                />
            </Grid>
            <Grid md={4}>
                <MetaData
                    label="Achievements Unlocked"
                    value={
                        totalAchievementCount && achievementsUnlockedCount
                            ? `${(
                                  achievementsUnlockedCount /
                                  totalAchievementCount
                              ).toFixed(2)}%`
                            : "-"
                    }
                    title={`${achievementsUnlockedCount ?? 0} of ${
                        totalAchievementCount ?? 0
                    }`}
                />
            </Grid>
            <Grid md={4}>
                <MetaData label="Friends" value={friends?.length ?? "-"} />
            </Grid>
        </Grid>
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

const RecentIcons = ({
    player,
    recentGames,
    recentAchievements,
}: {
    player: string
    recentGames: Game[]
    recentAchievements: UnlockedAchievement[]
}) => (
    <Grid container>
        <Grid xs={6}>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Played
            </Typography>

            <GameIconList player={player} games={recentGames} />

            <Link to={`/player/${player}/recentgames`}>
                <Typography fontSize={"small"}>more...</Typography>
            </Link>
        </Grid>
        <Grid xs={6}>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Unlocked
            </Typography>
            <Box>
                <AchievementIconList
                    player={player}
                    achievements={recentAchievements}
                />
                <Link to={`/player/${player}/recentachievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </Box>
        </Grid>
    </Grid>
)

const PlayerProfileHeader = ({
    id,
    name,
    avatarLargeUrl,
    summary,
}: {
    id: string
    name?: string
    avatarLargeUrl?: string
    profileUrl?: string
    summary?: PlayerSummary
}) => {
    return (
        <>
            <Header name={name ?? ""} />
            <Grid container gap="2em">
                <Grid xs={2}>
                    <BorderedImage src={avatarLargeUrl} />
                </Grid>
                <Grid xs>
                    <PlayerStatistics player={id} {...summary} />
                    {summary?.recentGames && summary?.recentAchievements && (
                        <RecentIcons
                            player={id}
                            recentGames={summary.recentGames}
                            recentAchievements={summary.recentAchievements}
                        />
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default PlayerProfileHeader
