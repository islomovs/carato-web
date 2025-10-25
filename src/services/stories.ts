import api from "@/lib/axios/instance";

export interface StoryImage {
  id: number;
  createdTime: string;
  title: string;
  startTime: string;
  endTime: string;
  textUz: string;
  textRu: string;
  textEn: string;
  image: string;
  sortOrder: number;
  redirectTo?: string;
}

export interface Story {
  id: number;
  text: string;
  createdTime: string;
  startTime: string;
  endTime: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  images: StoryImage[];
}

export async function getStories(locale: string): Promise<Story[]> {
  const response = await api.get<{ content?: Story[]; data?: Story[] }>(
    "/api/v1/stories/all",
    {
      headers: { "Accept-Language": locale },
    }
  );

  const data = response.data;
  // handle if backend returns { content: [...] } or plain array
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}
