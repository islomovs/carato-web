import api from "@/lib/axios/instance";

export interface ProductSet {
  id: number;
  slug: string;
  name: string;
}

export async function getProductSets(locale: string): Promise<ProductSet[]> {
  const response = await api.get<ProductSet[]>("/api/v1/product-sets/all", {
    headers: {
      "Accept-Language": locale,
    },
  });

  return response.data;
}
