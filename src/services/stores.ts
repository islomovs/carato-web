import api from "@/lib/axios/instance";

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

export async function fetchAllStores(
  page = 0,
  size = 100,
): Promise<Store[]> {
  const response = await api.get<Store[]>("/api/v1/stores/all", {
    params: { page, size },
  });
  return response.data;
}