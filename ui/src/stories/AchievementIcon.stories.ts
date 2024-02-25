import type { Meta, StoryObj } from "@storybook/react"

import AchievementIcon from "@/components/AchievementIcon"
import { gameWithAchievements } from "@test/data"

const meta = {
    title: "Achievement Icon",
    component: AchievementIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof AchievementIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = {
    args: {
        game: gameWithAchievements.name,
        achievement: gameWithAchievements.achievements[0],
        unlocked: undefined,
    },
}

export const UnlockedAtIcon: Story = {
    args: {
        game: gameWithAchievements.name,
        achievement: gameWithAchievements.achievements[0],
        unlocked: "2024-01-01T12:00:00Z",
    },
}

export const UnlockedIcon: Story = {
    args: {
        game: gameWithAchievements.name,
        achievement: gameWithAchievements.achievements[0],
        unlocked: true,
    },
}

export const LockedIcon: Story = {
    args: {
        game: gameWithAchievements.name,
        achievement: gameWithAchievements.achievements[0],
        unlocked: false,
    },
}
