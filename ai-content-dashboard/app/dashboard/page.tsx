import Link from "next/link"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { StatusBadge } from "@/components/shared/status-badge"
import { FileText, Sparkles, TrendingUp, Users } from "lucide-react"
import { getAllBriefs } from "./actions"

const iconMap = {
  Article: FileText,
  Thread: TrendingUp,
  LinkedIn: Users,
}

export default async function DashboardPage() {
  const briefs = await getAllBriefs()

  return (
    <div className="min-h-screen px-4 pt-32 pb-16">
      <div className="container mx-auto">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Active Agents: {briefs.length}</span>
          </div>
          <h1 className="text-balance text-5xl font-bold tracking-tight">
            Command <span className="text-gradient">Center</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Monitor your autonomous content agents in real-time. Track research progress, generation status, and
            performance metrics.
          </p>
        </div>

        {briefs.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20">
            <div className="text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Active Agents</h3>
              <p className="mb-6 text-muted-foreground">Deploy your first content agent to get started</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" />
                Deploy Agent
              </Link>
            </div>
          </div>
        ) : (
          <BentoGrid className="max-w-full">
            {briefs.map((brief, idx) => {
              const Icon = iconMap[brief.format as keyof typeof iconMap] || FileText
              return (
                <BentoGridItem
                  key={brief.id}
                  title={brief.topic}
                  description={
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{brief.format}</span>
                      <span className="text-muted-foreground">•</span>
                      <StatusBadge status={brief.status} />
                    </div>
                  }
                  header={
                    <Link
                      href={`/content/${brief.id}`}
                      className="flex min-h-[140px] w-full flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-muted/50 to-muted transition-all hover:from-primary/20 hover:to-accent/20"
                    >
                      <Icon className="h-16 w-16 text-primary/50" />
                    </Link>
                  }
                  icon={<Icon className="h-4 w-4 text-primary" />}
                  className={cn(idx === 3 || idx === 6 ? "md:col-span-2" : "")}
                />
              )
            })}
          </BentoGrid>
        )}
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
