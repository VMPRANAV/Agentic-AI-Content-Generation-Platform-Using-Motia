"use client"

import { use } from "react"
import { usePolling } from "@/hooks/use-polling"
import { ResearchCard } from "./components/research-card"
import { SEOScore } from "./components/seo-score"
import { SocialPreview } from "./components/social-preview"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { StatusBadge } from "@/components/shared/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, loading, error } = usePolling(id)

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold">Error Loading Content</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const { brief, content } = data
  const isReady = brief.status === "ready" && content

  return (
    <div className="min-h-screen px-4 pt-32 pb-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <StatusBadge status={brief.status} />
          <h1 className="text-balance text-4xl font-bold tracking-tight">{brief.topic}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono">{brief.format}</span>
            {brief.audience && (
              <>
                <span>•</span>
                <span>Target: {brief.audience}</span>
              </>
            )}
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Research */}
          <div className="lg:col-span-3">
            {isReady && content.research ? (
              <ResearchCard research={content.research} />
            ) : (
              <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
          </div>

          {/* Center Column - Content */}
          <div className="lg:col-span-6">
            <div className="space-y-6 rounded-lg border border-border/50 bg-card p-8">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Generated Content</h3>
              </div>
              {isReady && content.content ? (
                <div className="prose prose-invert max-w-none">
                  <TextGenerateEffect words={content.content.substring(0, 500)} />
                  <ReactMarkdown className="mt-4 leading-relaxed text-foreground">
                    {content.content.substring(500)}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Agent is researching and generating content...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Metrics */}
          <div className="space-y-6 lg:col-span-3">
            {isReady && content.seo ? (
              <SEOScore seo={content.seo} />
            ) : (
              <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mx-auto h-40 w-40 rounded-full" />
              </div>
            )}

            {isReady && content.social ? (
              <SocialPreview social={content.social} />
            ) : (
              <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
