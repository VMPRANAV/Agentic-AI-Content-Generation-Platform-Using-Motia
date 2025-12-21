"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { contentApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import { MovingBorder } from "@/components/ui/moving-border"

export function CreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    format: "Article",
    audience: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const brief = await contentApi.createBrief({
        topic: formData.topic,
        format: formData.format,
        audience: formData.audience || undefined,
      })

      // Redirect to content viewer with the new brief ID
      router.push(`/content/${brief.id}`)
    } catch (error) {
      console.error("Error creating brief:", error)
      alert("Failed to create content brief. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MovingBorder duration={3000} containerClassName="w-full max-w-2xl" className="p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI Content Generation
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Deploy Content Agent</h2>
          <p className="text-muted-foreground">Configure your autonomous agent to research and generate content</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Topic
            </Label>
            <Input
              id="topic"
              placeholder="Enter your content topic..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="h-12 bg-muted/50 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium">
              Format
            </Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
              <SelectTrigger className="h-12 bg-muted/50 font-mono">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="Thread">Twitter Thread</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience" className="text-sm font-medium">
              Target Audience (Optional)
            </Label>
            <Textarea
              id="audience"
              placeholder="Describe your target audience..."
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="min-h-[100px] resize-none bg-muted/50 font-mono"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="group relative h-12 w-full overflow-hidden bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] font-bold transition-all hover:bg-[position:100%_0]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initializing Agent...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Content
            </>
          )}
        </Button>
      </form>
    </MovingBorder>
  )
}
