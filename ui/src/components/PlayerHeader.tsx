import { ReactNode, useContext } from "react"
import { Typography, Box, IconButton, Stack } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import BorderedImage from "./BorderedImage"
import PlayerSettingsContext from "@/context/PlayerSettingsContext"
import Loader from "./Loader"
import Timeline from "./Timeline"
import ExternalLink from "./ExternalLink"
import Link from "./Link"
import RecentActivity from "./RecentActivity"
import { playerProfile } from "@/api/documents"
import { useQuery } from "graphql-hooks"

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
    const { hideGameStatistics, toggleGameStatistics } = useContext(
        PlayerSettingsContext
    )

    return (
        <Box sx={{ display: "flex", marginBottom: "0.25em" }}>
            <Link to={`/Player/${id}`}>{name}</Link>
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
    display = true,
}: {
    label: string
    value: ReactNode | string | number
    title?: string
    link?: string
    display?: boolean
}) => (
    <Box sx={{ display: display ? "block" : "none" }}>
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

interface PlayerStatisticsContentProps extends PlayerProfile {
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
    const { hideGameStatistics } = useContext(PlayerSettingsContext)

    return (
        <Stack direction="row" useFlexGap spacing={4}>
            <MetaData
                label="Games"
                value={ownedGames ?? 0}
                display={!hideGameStatistics}
            />

            <MetaData
                label="Played"
                value={
                    ownedGames && playedGames
                        ? `${((playedGames / ownedGames) * 100).toFixed(2)}%`
                        : "-"
                }
                title={`${playedGames ?? 0} of ${ownedGames ?? 0}`}
                display={!hideGameStatistics}
            />
            <MetaData
                label="Play Time"
                value={<Playtime playtime={totalPlaytime ?? 0} />}
                display={!hideGameStatistics}
            />
            <MetaData
                label="Perfect Games"
                value={`${perfectGames} (${(
                    (perfectGames / ownedGames) *
                    100
                ).toFixed(2)})%`}
                title={`${perfectGames} of ${ownedGames}`}
                link={`/Player/${player}/PerfectGames`}
            />
            <MetaData
                label="Achievements Unlocked"
                value={`${(
                    (unlockedAchievements / lockedAchievements) *
                    100
                ).toFixed(2)}%`}
                title={`${unlockedAchievements} of ${lockedAchievements}`}
            />
        </Stack>
    )
}

const PlayerStatistics = ({ player }: { player: string }) => {
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerProfile,
        { variables: { player } }
    )

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(response) => {
                return (
                    <PlayerStatisticsContent
                        player={player}
                        {...response.player!.profile!}
                    />
                )
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
            <Stack direction="row" useFlexGap spacing={1}>
                <BorderedImage
                    src={avatarLargeUrl}
                    style={{
                        width: "100%",
                        maxWidth: "184px",
                        margin: "0 0",
                    }}
                />
                <Box>
                    <PlayerStatistics player={id} />
                    <Stack direction="row">
                        <RecentActivity player={id} />
                        <Timeline player={id} />
                    </Stack>
                </Box>
            </Stack>
        </>
    )
}

export default PlayerProfileHeader
