import type { Meta, StoryObj } from "@storybook/react"

import GameHeader from "."
import { gameWithAchievements } from "@test/data"
import { MemoryRouter } from "react-router-dom"

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
