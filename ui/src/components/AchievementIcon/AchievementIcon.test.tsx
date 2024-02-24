import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import AchievementIcon from "."
import { achievement } from "@test/data"

test("snapshot", () => {
    const achievementIcon = renderer.create(
        <AchievementIcon game="Test Game" achievement={achievement} />
    )
    expect(achievementIcon.toJSON()).toMatchSnapshot()

    const unlockedAchievementIcon = renderer.create(
        <AchievementIcon
            game="Test Game"
            achievement={achievement}
            unlocked="2015-03-09T01:17:41+00:00"
        />
    )
    expect(unlockedAchievementIcon.toJSON()).toMatchSnapshot()
})
