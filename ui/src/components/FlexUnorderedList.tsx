import styled from "@emotion/styled"

const FlexUnorderedList = styled.ul(
    ({
        wrap = false,
        justifyContent = "space-evenly",
        gap = 8,
    }: {
        wrap?: boolean
        justifyContent?: string
        gap?: number | string
    }) => ({
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        justifyContent: justifyContent,
        gap: gap,
    })
)

export default FlexUnorderedList
