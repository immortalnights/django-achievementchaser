import type { Meta, StoryObj } from "@storybook/react"

import GameHeader from "@/components/GameHeader"
import { gameWithAchievements } from "@test/data"
import { MemoryRouter } from "react-router-dom"

const meta = {
    title: "Game Header",
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
    },
}
