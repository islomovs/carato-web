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
  subtitle?: string;
  author?: string;
}

export async function getNews(locale: string, page = 1, size = 6) {
  const response = await api.get<{ content: NewsItem[] }>(`/api/v1/news/all`, {
    params: { page, size },
    headers: { "Accept-Language": locale },
  });

  return Array.isArray(response.data) ? response.data : response.data.content;
}

export async function getNewsBySlug(slug: string, locale: string) {
  const response = await api.get<NewsItem>(`/api/v1/news/${slug}`, {
    headers: { "Accept-Language": locale },
  });

  return response.data;
}
