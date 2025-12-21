"use server"

import { contentApi } from "@/lib/api"

export async function getAllBriefs() {
  try {
    const briefs = await contentApi.getAllBriefs()
    return briefs
  } catch (error) {
    console.error("Error fetching briefs:", error)
    return []
  }
}
