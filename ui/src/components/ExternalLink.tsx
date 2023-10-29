import { OpenInNew } from "@mui/icons-material"
import { Link } from "@mui/material"

const ExternalLink = ({ href, title }: { href: string; title: string }) => (
    <Link href={href} title={title} target="_blank" rel="noopener">
        <OpenInNew fontSize="small" />
    </Link>
)

export default ExternalLink
