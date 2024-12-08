import renderer from "react-test-renderer"
import { expect, test, vi } from "vitest"
import OwnedGameLastPlayed from "."
import { playedPlayerOwnedGame } from "@test/data"

test("snapshot", () => {
    vi.setSystemTime("2024-02-23T12:00:00Z")

    // eslint-disable-next-line
    const component = renderer.create(
        <OwnedGameLastPlayed {...playedPlayerOwnedGame} />
    )
    expect(component.toJSON()).toMatchSnapshot()

    vi.useRealTimers()
})
