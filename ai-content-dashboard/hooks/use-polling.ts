"use client"

import { useState, useEffect, useCallback } from "react"
import { contentApi } from "@/lib/api"
import type { ContentBriefResponse } from "@/lib/types"

export function usePolling(briefId: string | null, interval = 3000) {
  const [data, setData] = useState<ContentBriefResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBrief = useCallback(async () => {
    if (!briefId) return

    try {
      const response = await contentApi.getBrief(briefId)
      setData(response)
      setError(null)

      // Stop polling if status is ready
      if (response.brief.status === "ready") {
        setLoading(false)
      }
    } catch (err) {
      setError(err as Error)
      setLoading(false)
    }
  }, [briefId])

  useEffect(() => {
    if (!briefId) return

    // Initial fetch
    fetchBrief()

    // Setup polling if not ready
    const pollInterval = setInterval(() => {
      if (data?.brief.status !== "ready") {
        fetchBrief()
      }
    }, interval)

    return () => clearInterval(pollInterval)
  }, [briefId, data?.brief.status, fetchBrief, interval])

  return { data, loading, error, refetch: fetchBrief }
}
