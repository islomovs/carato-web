import api from "@/lib/axios/instance";

export interface NewsItem {
  id: number;
  createdTime: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  mobileImage: string;
  desktopImage: string;
}

export async function getNews(locale: string, page = 1, size = 6) {
  const response = await api.get<{ content: NewsItem[] }>(`/api/v1/news/all`, {
    params: { page, size },
    headers: { "Accept-Language": locale },
  });

  return Array.isArray(response.data) ? response.data : response.data.content;
}
