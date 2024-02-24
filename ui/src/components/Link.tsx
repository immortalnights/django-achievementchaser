import { forwardRef } from "react"
import { LinkProps, Link as MaterialLink } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <MaterialLink component={RouterLink} underline="none" {...props} ref={ref}>
        {props.children}
    </MaterialLink>
))

export default Link
