import api from "@/lib/axios/instance";

export interface Collection {
  id: number;
  slug: string;
  title: string;
  mobileImage: string;
  desktopImage: string;
}

export async function getCollections(locale: string) {
  const response = await api.get<Collection[]>(
    "api/v1/catalogue-collections/all",
    {
      headers: {
        "Accept-Language": locale,
      },
    }
  );
  return response.data;
}
