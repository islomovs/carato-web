import api from "@/lib/axios/instance";
import { getLocale } from "next-intl/server";

export interface Store {
  id: number;
  name: string;
  workingHours: string;
  phone: string;
  address: string;
  addressLink: string;
  longitude: number;
  latitude: number;
}

interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export async function fetchAllStores(
  page = 0,
  size = 100,
  locale?: string,
): Promise<Store[]> {
  const resolvedLocale = locale ?? (await getLocale());
  const response = await api.get<PageableResponse<Store>>(
    "/api/v1/stores/all",
    {
      params: { page, size },
      headers: { "Accept-Language": resolvedLocale },
    },
  );
  return response.data.content;
}
