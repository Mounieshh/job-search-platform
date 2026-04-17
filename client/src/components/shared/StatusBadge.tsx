import { Badge } from "../ui/badge"

interface BadgeProps {
    status: string
}

const statusClasses: Record<string, string> = {
    approved:    "bg-primary/10 text-primary border-primary/20",
    pending:     "bg-muted text-muted-foreground border-border",
    rejected:    "bg-destructive/10 text-destructive border-destructive/20",
    shortlisted: "bg-secondary/10 text-secondary border-secondary/20",
    draft:       "bg-muted text-muted-foreground border-border",
}

const StatusBadge = ({ status }: BadgeProps) => {
    const classes = statusClasses[status.toLowerCase()] ?? "bg-muted text-muted-foreground border-border"

    return (
        <Badge className={classes}>
            {status}
        </Badge>
    )
}

export default StatusBadge
