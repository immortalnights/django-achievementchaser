import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import CircularProgressWithLabel from "."

test("snapshot", () => {
    // eslint-disable-next-line
    const component = renderer.create(
        <CircularProgressWithLabel value={50} color="primary" />
    )
    expect(component.toJSON()).toMatchSnapshot()
})
