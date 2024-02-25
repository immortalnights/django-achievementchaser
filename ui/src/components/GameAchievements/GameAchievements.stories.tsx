import type { Meta, StoryObj } from "@storybook/react"

import GameAchievements from "."
import {
    antenna,
    antennaPlayerCompleted,
    antennaPlayerPartial,
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

export const Antenna: Story = {
    args: {
        achievements: antenna.achievements,
    },
}

export const AntennaOwnedIncomplete: Story = {
    args: {
        achievements: antenna.achievements,
        player1Achievements: [],
    },
}

export const AntennaOwnedComplete: Story = {
    args: {
        achievements: antenna.achievements,
        player1Achievements: antennaPlayerCompleted,
    },
}

export const AntennaComparison: Story = {
    args: {
        achievements: antenna.achievements,
        player1Achievements: antennaPlayerCompleted,
        player2Achievements: antennaPlayerPartial,
    },
}

export const WithoutAchievements: Story = {
    args: {
        achievements: [],
    },
}
