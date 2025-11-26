/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios/instance";
import { Product } from "./product";

interface PaginatedProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
}

export async function getProductsBySet(
  slug: string,
  page: number,
  size: number,
  locale: string
): Promise<Product[]> {
  try {
    const response = await api.get<PaginatedProductResponse>(
      `/api/v1/product-sets/${slug}/products`,
      { params: { page, size }, headers: { "Accept-Language": locale } }
    );

    return response.data.content;
  } catch (error: any) {
    console.error("🔥 API ERROR:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });

    throw error;
  }
}
