import { ReactNode, useContext } from "react"
import { Typography, Box, IconButton, Stack } from "@mui/material"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import BorderedImage from "./BorderedImage"
import PlayerSettingsContext from "@/context/PlayerSettingsContext"
import Timeline from "./Timeline"
import ExternalLink from "./ExternalLink"
import Link from "./Link"
import { playerProfile } from "@/api/documents"
import { useQuery } from "graphql-hooks"
import RecentlyPlayedGames from "./RecentlyPlayedGames"
import RecentlyUnlockedAchievements from "./RecentlyUnlockedAchievements"
import { percentage } from "@/utilities"
import { duration } from "@/dayjsUtilities"

const Title = ({
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
            <Link to={`/Player/${id}`} variant="h4">
                {name}
            </Link>
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
    value: ReactNode | string | number | undefined
    title?: string
    link?: string
    display?: boolean
}) => (
    <Box sx={{ display: display ? "block" : "none" }}>
        <Typography variant="subtitle1" textTransform="uppercase">
            {label}
        </Typography>
        <Typography variant="body1" title={title}>
            {value && link ? (
                <Link to={link} variant="subtitle1">
                    {value}
                </Link>
            ) : (
                value ?? "-"
            )}
        </Typography>
    </Box>
)

const PlayerStatistics = ({
    player,
    ownedGames,
    perfectGames,
    playedGames,
    totalPlaytime,
    unlockedAchievements,
    lockedAchievements,
}: { player: string } & Partial<PlayerProfile>) => {
    const { hideGameStatistics } = useContext(PlayerSettingsContext)

    const perfectGameValue =
        perfectGames &&
        ownedGames &&
        `${perfectGames} (${percentage(perfectGames, ownedGames)})`

    const unlockedAchievementsValue =
        unlockedAchievements &&
        lockedAchievements &&
        percentage(unlockedAchievements, lockedAchievements)

    return (
        <Stack direction="row" useFlexGap spacing={4}>
            <MetaData
                label="Games"
                value={ownedGames}
                display={!hideGameStatistics}
            />

            <MetaData
                label="Played"
                value={
                    ownedGames &&
                    playedGames &&
                    percentage(playedGames, ownedGames)
                }
                title={`${playedGames ?? "-"} of ${ownedGames ?? "-"}`}
                display={!hideGameStatistics}
            />
            <MetaData
                label="Play Time"
                value={`${duration(totalPlaytime ?? 0)
                    .asYears()
                    .toFixed(2)} years`}
                display={!hideGameStatistics}
            />
            <MetaData
                label="Perfect Games"
                value={perfectGameValue}
                title={`${perfectGames ?? "-"} of ${ownedGames ?? "-"}`}
                link={`/Player/${player}/PerfectGames`}
            />
            <MetaData
                label="Achievements Unlocked"
                value={unlockedAchievementsValue}
                title={`${unlockedAchievements ?? "-"} of ${
                    lockedAchievements ?? "-"
                }`}
            />
        </Stack>
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
    const { data } = useQuery<PlayerQueryResponse>(playerProfile, {
        variables: { player: id },
    })

    return (
        <>
            <Title id={id} name={name ?? ""} url={profileUrl ?? ""} />
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
                    <PlayerStatistics player={id} {...data?.player?.profile} />
                    <Stack direction="row">
                        <Box>
                            <RecentlyPlayedGames player={id} />
                            <RecentlyUnlockedAchievements player={id} />
                        </Box>
                        <Timeline player={id} />
                    </Stack>
                </Box>
            </Stack>
        </>
    )
}

export default PlayerProfileHeader
