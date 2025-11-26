/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios/instance";

export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  characteristics: string;
  price: number;
  discountPrice?: number | null;
  discountPercent?: number;
  category: { id: number; name: string; slug: string };
  subcategory?: { id: number; name: string; slug: string };
  metal: { id: number; name: string; fineness: number };
  weight: number;
  images: { image: string }[];
  variants: [{ size: { id: number; name: string } }];
  averageRating: number;
  reviewsQuantity: number;
}

export async function getProductBySlug(
  slug: string,
  locale: string
): Promise<Product> {
  try {
    const response = await api.get<Product>(`/api/v1/products/${slug}`, {
      headers: { "Accept-Language": locale },
    });
    return response.data;
  } catch (error: any) {
    console.error("🔥 API ERROR (getProductBySlug):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });
    throw error;
  }
}
