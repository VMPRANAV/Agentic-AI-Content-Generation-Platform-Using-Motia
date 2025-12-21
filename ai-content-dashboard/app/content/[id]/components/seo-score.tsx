"use client"

import { TrendingUp } from "lucide-react"
import type { SEOMetrics } from "@/lib/types"

interface SEOScoreProps {
  seo: SEOMetrics
}

export function SEOScore({ seo }: SEOScoreProps) {
  const score = seo.score || 0
  const percentage = (score / 100) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="space-y-6 rounded-lg border border-border/50 bg-card p-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">SEO Metrics</h3>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full -rotate-90 transform">
            <circle cx="80" cy="80" r="45" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted" />
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--cyber-cyan)" />
                <stop offset="100%" stopColor="var(--cyber-violet)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gradient">{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Readability</span>
          <span className="font-mono font-bold">{seo.readability || "N/A"}</span>
        </div>
        {seo.keywords && seo.keywords.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Keywords</span>
            <div className="flex flex-wrap gap-2">
              {seo.keywords.map((keyword, idx) => (
                <span key={idx} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
