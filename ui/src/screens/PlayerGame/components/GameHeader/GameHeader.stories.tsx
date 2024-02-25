import type { Meta, StoryObj } from "@storybook/react"

import GameHeader from "."
import { antenna, gameWithAchievements } from "@test/data"
import { MemoryRouter } from "react-router-dom"
import PlayerCompareContext, {
    PlayerCompareContextValue,
} from "../../context/PlayerCompareContext"
import { useState } from "react"

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

export const Header: Story = {
    args: {
        game: gameWithAchievements,
        owner: undefined,
        compare: false,
    },
}

export const Owned: Story = {
    args: {
        game: antenna,
        owner: antenna.owners.edges[0].node,
        compare: false,
    },
}

export const Compare: Story = {
    decorators: [
        (Story) => {
            const [comparePlayer, setComparePlayer] = useState<
                string | undefined
            >("76561198013854782")

            const contextValue: PlayerCompareContextValue = {
                otherPlayer: comparePlayer,
                setOtherPlayer: (value: string | undefined) =>
                    setComparePlayer(value),
            }

            return (
                <PlayerCompareContext.Provider value={contextValue}>
                    <Story />
                </PlayerCompareContext.Provider>
            )
        },
    ],
    args: {
        game: antenna,
        owner: antenna.owners.edges[0].node,
        compare: true,
    },
}
