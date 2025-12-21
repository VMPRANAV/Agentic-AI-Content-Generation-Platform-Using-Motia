"use client"
import { Twitter, Linkedin } from "lucide-react"
import type { SocialPost } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SocialPreviewProps {
  social: SocialPost
}

export function SocialPreview({ social }: SocialPreviewProps) {
  return (
    <div className="space-y-6 rounded-lg border border-border/50 bg-card p-6">
      <h3 className="text-lg font-bold">Social Posts</h3>

      <Tabs defaultValue="twitter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </TabsTrigger>
        </TabsList>
        <TabsContent value="twitter" className="space-y-4">
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {social.twitter?.text || "No content generated yet"}
            </p>
            {social.twitter?.hashtags && social.twitter.hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {social.twitter.hashtags.map((tag, idx) => (
                  <span key={idx} className="font-mono text-xs text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="linkedin" className="space-y-4">
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {social.linkedin?.text || "No content generated yet"}
            </p>
            {social.linkedin?.hashtags && social.linkedin.hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {social.linkedin.hashtags.map((tag, idx) => (
                  <span key={idx} className="font-mono text-xs text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
