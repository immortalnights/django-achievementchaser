import { forwardRef } from "react"
import { LinkProps, Link as MaterialLink } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

const Link = forwardRef<HTMLAnchorElement, LinkProps & { to: string }>(
    (props, ref) => (
        <MaterialLink
            component={RouterLink}
            underline="none"
            {...props}
            href={props.to}
            ref={ref}
        >
            {props.children}
        </MaterialLink>
    )
)

export default Link
