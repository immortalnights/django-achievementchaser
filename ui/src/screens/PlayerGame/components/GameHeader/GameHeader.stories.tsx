import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { MemoryRouter } from "react-router-dom"
import {
    antenna,
    antennaMultipleOwners,
    gameWithoutAchievements,
} from "@test/data"
import AchievementDisplayContext, {
    AchievementDisplayContextValue,
} from "../../context/AchievementDisplayContext"
import GameHeader from "."

const meta = {
    title: "Game Header 2",
    component: GameHeader,
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
    argTypes: {},
} satisfies Meta<typeof GameHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Game with achievements, but no owner.
 * Displays title, icon, difficulty and search.
 */
export const WithAchievementsNotOwned: Story = {
    args: {
        game: antenna,
        owner: undefined,
        compare: false,
    },
}

/**
 * Game with achievements and single owner.
 * Displays title, icon, difficultly, owner stats, search and filtering.
 */
export const WithAchievementsOwned: Story = {
    args: {
        game: antenna,
        owner: antenna.owners.edges[0].node,
        compare: false,
    },
}

/**
 * Game with achievements and multiple owners.
 * Displays title, icon, difficulty, owner stats, search, compare and filtering.
 */
export const WithAchievementsCompare: Story = {
    args: {
        game: antennaMultipleOwners,
        owner: antennaMultipleOwners.owners.edges[0].node,
        compare: false,
    },
}

/**
 * Game with achievement comparison.
 * Displays title, icon, search, clear compare and filtering.
 */
export const Compare: Story = {
    decorators: [
        (Story) => {
            const [comparePlayer, setComparePlayer] = useState<
                string | undefined
            >("76561198013854782")

            const contextValue: AchievementDisplayContextValue = {
                filter: "",
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setFilter: () => {},
                otherPlayer: comparePlayer,
                setOtherPlayer: (value: string | undefined) =>
                    setComparePlayer(value),
            }

            return (
                <AchievementDisplayContext.Provider value={contextValue}>
                    <Story />
                </AchievementDisplayContext.Provider>
            )
        },
    ],
    args: {
        game: antennaMultipleOwners,
        owner: antennaMultipleOwners.owners.edges[0].node,
        compare: true,
    },
}

/**
 * Game without achievements or owner.
 * Displays title and icon.
 */
export const WithoutAchievementsNotOwned: Story = {
    args: {
        game: gameWithoutAchievements,
        owner: undefined,
        compare: false,
    },
}

/**
 * Game without achievements with owner.
 * Displays title, icon and owner stats.
 */
export const WithoutAchievementsOwned: Story = {
    args: {
        game: gameWithoutAchievements,
        owner: antenna.owners.edges[0].node,
        compare: false,
    },
}
