import api from "@/lib/axios/instance";

export interface QAItem {
  id: number;
  title: string;
  description: string;
}

export async function fetchAllQA(locale: string): Promise<QAItem[]> {
  const response = await api.get<QAItem[]>("/api/v1/q&a/all", {
    headers: { "Accept-Language": locale },
  });
  return response.data;
}
