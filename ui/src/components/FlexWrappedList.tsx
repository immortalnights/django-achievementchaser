import styled from "@emotion/styled"

const FlexWrappedList = styled.ul<{ justifyContent?: string }>`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: ${(props) => props.justifyContent ?? "space-evenly"};
    gap: 0.25em;
`

export default FlexWrappedList
