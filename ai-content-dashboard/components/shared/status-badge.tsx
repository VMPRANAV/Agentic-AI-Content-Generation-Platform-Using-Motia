import { cn } from "@/lib/utils"
import { Loader2, CheckCircle2, Clock } from "lucide-react"

interface StatusBadgeProps {
  status: "pending" | "researching" | "ready"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-muted text-muted-foreground",
    },
    researching: {
      icon: Loader2,
      label: "Researching",
      className: "bg-primary/20 text-primary",
      animate: true,
    },
    ready: {
      icon: CheckCircle2,
      label: "Ready",
      className: "bg-accent/20 text-accent",
    },
  }

  const { icon: Icon, label, className: statusClass, animate } = config[status]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        statusClass,
        className,
      )}
    >
      <Icon className={cn("h-3 w-3", animate && "animate-spin")} />
      {label}
    </div>
  )
}
