import { Badge } from "../ui/badge"

interface BadgeProps {
    status: string
}

const StatusBadge = ({ status }: BadgeProps) => {

    const classColors: Record<string, string> = {
        approved: "bg-green-100 text-green-800 border-green-200",
        pending:  "bg-yellow-100 text-yellow-800 border-yellow-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        draft:    "bg-gray-100 text-gray-800 border-gray-200",
    }

    const classes = classColors[status.toLowerCase()] ?? "bg-gray-100 text-gray-800 border-gray-200"

    return (
        <Badge className={classes}>
            {status}
        </Badge>
    )
}

export default StatusBadge