import styled from "@emotion/styled"

const FlexWrappedList = styled.ul<{ justifyContent?: string; margin?: string }>`
    list-style: none;
    padding: 0;
    margin: ${(props) => props.margin ?? 0};
    display: flex;
    flex-wrap: wrap;
    justify-content: ${(props) => props.justifyContent ?? "space-evenly"};
    gap: 0.25em;
`

export default FlexWrappedList
