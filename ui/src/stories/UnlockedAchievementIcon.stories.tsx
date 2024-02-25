import type { Meta, StoryObj } from "@storybook/react"

import UnlockedAchievementIcon from "@/components/UnlockedAchievementIcon"
import { gameWithAchievements } from "@test/data"
import { MemoryRouter } from "react-router-dom"

const meta = {
    title: "Unlocked Achievement Icon",
    component: UnlockedAchievementIcon,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    tags: ["autodocs"],
    argTypes: {
        size: ["sm", "lg"],
    },
} satisfies Meta<typeof UnlockedAchievementIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = {
    args: {
        player: "12345",
        unlockedAchievement: {
            id: "1",
            game: gameWithAchievements,
            achievement: gameWithAchievements.achievements[0],
            datetime: "2024-01-01T12:00:00Z",
        },
    },
}
