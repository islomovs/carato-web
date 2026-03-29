import api from "@/lib/axios/instance";
import { Product } from "@/services/product";

export interface ProductSet {
  id: number;
  slug: string;
  name: string;
}

export async function getProductSets(locale: string): Promise<ProductSet[]> {
  const response = await api.get<ProductSet[]>("/api/v1/product-sets/all", {
    headers: { "Accept-Language": locale },
  });
  return response.data;
}

export interface ProductSetPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
}

export async function getProductsBySet(
  slug: string,
  page: number,
  size: number,
  locale: string,
): Promise<Product[]> {
  const response = await api.get<ProductSetPage>(
    `/api/v1/product-sets/${slug}/products`,
    {
      headers: { "Accept-Language": locale },
      params: { page, size },
    },
  );
  return response.data.content;
}
