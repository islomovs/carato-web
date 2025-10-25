import api from "@/lib/axios/instance";

export interface Banner {
  id: number;
  text: string;
  mobileImage: string;
  desktopImage: string;
  redirectTo: string;
}

export async function getBanners(locale: string) {
  const response = await api.get<Banner[]>("/api/v1/banners/all", {
    headers: {
      "Accept-Language": locale,
    },
  });

  return response.data;
}
