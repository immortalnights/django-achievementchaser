import { ReactNode } from "react"
import { Link as MaterialLink, TypographyVariant } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

const Link = ({
    to,
    title,
    variant = "h4",
    children,
}: {
    to: string
    title?: string
    variant?: TypographyVariant
    children: ReactNode | string | number
}) => (
    <MaterialLink
        component={RouterLink}
        to={to}
        title={title}
        variant={variant}
        underline="none"
    >
        {children}
    </MaterialLink>
)

export default Link
