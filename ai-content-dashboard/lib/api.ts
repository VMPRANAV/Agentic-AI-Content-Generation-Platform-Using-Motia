import axios from "axios"
import type { ContentBrief, FinalContent, ContentBriefResponse } from "./types"

// Configure your Motia backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// API methods
export const contentApi = {
  // Create a new content brief
  createBrief: async (data: {
    topic: string
    format: string
    audience?: string
  }): Promise<ContentBrief> => {
    const response = await api.post("/api/content-brief", data)
    return response.data
  },

  // Get a specific brief by ID
  getBrief: async (id: string): Promise<ContentBriefResponse> => {
    const response = await api.get(`/api/brief/${id}`)
    return response.data
  },

  // Get all briefs
  getAllBriefs: async (): Promise<ContentBrief[]> => {
    const response = await api.get("/api/briefs")
    return response.data
  },

  // Get content for a brief
  getContent: async (id: string): Promise<FinalContent> => {
    const response = await api.get(`/api/content/${id}`)
    return response.data
  },
}
