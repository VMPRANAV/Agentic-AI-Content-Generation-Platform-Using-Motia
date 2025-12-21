"use client"

import { HoverEffect } from "@/components/ui/card-hover-effect"
import type { ResearchItem } from "@/lib/types"
import { BookOpen } from "lucide-react"

interface ResearchCardProps {
  research: ResearchItem[]
}

export function ResearchCard({ research }: ResearchCardProps) {
  const items = research.map((item) => ({
    title: item.finding,
    description: item.source || "Internal Research",
  }))

  return (
    <div className="h-full space-y-4 overflow-y-auto rounded-lg border border-border/50 bg-card p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Research Findings</h3>
      </div>
      <HoverEffect items={items} />
    </div>
  )
}
