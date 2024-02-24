import type { Meta, StoryObj } from "@storybook/react"

import GameAchievements from "."
import {
    antenna,
    antennaPlayerCompleted,
    antennaPlayerPartial,
    gameWithAchievements,
    gameWithoutAchievements,
} from "@test/data"

const meta = {
    title: "Game Achievements",
    component: GameAchievements,
    parameters: {},
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof GameAchievements>

export default meta
type Story = StoryObj<typeof meta>

export const WithAchievements: Story = {
    args: {
        achievements: antenna.achievements,
    },
}

export const AntennaOwned: Story = {
    args: {
        achievements: antenna.achievements,
        player1Achievements: antennaPlayerCompleted
    },
}

export const WithoutAchievements: Story = {
    args: {
        achievements: [],
        player1Achievements: antennaPlayerCompleted
        player2Achievements: antennaPlayerPartial
    },
}
