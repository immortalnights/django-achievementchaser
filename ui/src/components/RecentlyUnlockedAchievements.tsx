import { Stack, Typography } from "@mui/material"
import Link from "./Link"
import UnlockedAchievementIcon from "./UnlockedAchievementIcon"
import SkeletonList from "./SkeletonList"
import { unwrapEdges } from "@/api/utils"
import { useQuery } from "graphql-hooks"
import { playerUnlockedAchievements } from "@/api/documents"

const RecentlyUnlockedAchievements = ({ player }: { player: string }) => {
    const { data } = useQuery<PlayerQueryResponse>(playerUnlockedAchievements, {
        variables: { player, orderBy: "-datetime", limit: 6 },
    })

    const achievements = data && unwrapEdges(data.player?.unlockedAchievements)

    return (
        <>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Unlocked
            </Typography>

            <Stack
                direction="row"
                useFlexGap
                gap={1}
                alignItems="center"
                justifyContent="space-between"
            >
                {achievements ? (
                    achievements.map((unlockedAchievement) => (
                        <UnlockedAchievementIcon
                            key={`${unlockedAchievement.game.id}-${unlockedAchievement.achievement.id}`}
                            player={player}
                            unlockedAchievement={unlockedAchievement}
                        />
                    ))
                ) : (
                    <SkeletonList count={6} />
                )}

                <Link to={`/Player/${player}/Achievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </Stack>
        </>
    )
}

export default RecentlyUnlockedAchievements
