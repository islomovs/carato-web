/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios/instance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorySummary {
  id: number;
  title: string;
  image: string;
}

export interface StoryMediaItem {
  id: number;
  startTime: string;
  text: string;
  image: string; // may be a video URL — use isVideoUrl() to check
  redirectTo: string;
}

export interface StoryDetail {
  id: number;
  media: StoryMediaItem[];
}

// Alias used by the hook and components
export type Story = StorySummary;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// ─── API calls ────────────────────────────────────────────────────────────────

// GET /api/v1/stories/all — thumbnail list shown on home page
export async function getStories(locale: string): Promise<Story[]> {
  try {
    const response = await api.get<Story[]>("/api/v1/stories/all", {
      headers: { "Accept-Language": locale },
    });
    return response.data;
  } catch (error: any) {
    console.error("🔥 API ERROR (getStories):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
}

export async function getStoryById(
  id: number,
  locale: string,
): Promise<StoryDetail> {
  const response = await api.get<StoryDetail>(`/api/v1/stories/${id}`, {
    headers: { "Accept-Language": locale },
  });
  return response.data;
}
