import type { Meta, StoryObj } from "@storybook/react"

import GameAchievementsContainer from "."
import {
    antenna,
    antennaMultipleOwners,
    gameWithoutAchievements,
} from "@test/data"

const meta = {
    title: "Player Game Achievements",
    component: GameAchievementsContainer,
    parameters: {},
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof GameAchievementsContainer>

export default meta
type Story = StoryObj<typeof meta>

export const NoAchievements: Story = {
    args: {
        game: gameWithoutAchievements,
    },
}

export const WithAchievements: Story = {
    args: {
        game: antenna,
    },
}

export const WithAchievementsAndOwner: Story = {
    args: {
        game: antenna,
        player1: antenna.owners.edges[0].node.player,
    },
}

export const WithAchievementsAndMultipleOwner: Story = {
    args: {
        game: antennaMultipleOwners,
        player1: antenna.owners.edges[0].node.player,
        player2: antenna.owners.edges[1].node.player,
    },
}
