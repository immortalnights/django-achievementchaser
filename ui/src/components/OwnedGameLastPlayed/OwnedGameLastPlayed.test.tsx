import renderer from "react-test-renderer"
import { expect, test, vi } from "vitest"
import OwnedGameLastPlayed from "."
import { playedPlayerOwnedGame } from "@test/data"
import { setup } from "@/dayjsUtilities"

test("snapshot", () => {
    setup()

    vi.setSystemTime("2024-02-23T12:00:00Z")

    const component = renderer.create(
        <OwnedGameLastPlayed {...playedPlayerOwnedGame} />
    )
    expect(component.toJSON()).toMatchSnapshot()

    vi.useRealTimers()
})
