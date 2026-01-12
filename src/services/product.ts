/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios/instance";

export interface ProductVariant {
  size: { id: number; name: string };
  price: number;
  discountPrice: number;
  discountPercent: number;
  stockQuantity: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  characteristics: string;
  price: number;
  category: { id: number; name: string; slug: string };
  metal: { id: number; name: string; fineness: number };
  weight: number;
  images: { image: string }[];
  variants: ProductVariant[];
  averageRating: number;
  reviewsQuantity: number;
  description: string;
  discountPrice?: number | null;
  discountPercent?: number;
  subcategory?: { id: number; name: string; slug: string };
  stockQuantity: 0;
  metalPrice: 0;
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

export interface ProductsFilterParams {
  page: number;
  size: number;
  search?: string;
  priceFrom?: number;
  priceTo?: number;
  weightFrom?: number;
  weightTo?: number;
  categorySlug?: string;
  subcategorySlug?: string;
  metals?: number[];
  sizes?: number[];
}

export const INITIAL_FILTERS = {
  search: "",
  priceFrom: null as number | null,
  priceTo: null as number | null,
  weightFrom: null as number | null,
  weightTo: null as number | null,
  categorySlug: "",
  subcategorySlug: "",
  metals: [] as number[],
  sizes: [] as number[],
};

export async function fetchAllProducts(params: ProductsFilterParams, locale: string) {
  const response = await api.get("/api/v1/products/all", {
    headers: { "Accept-Language": locale },
    params: {
      page: params.page,
      size: params.size,
      search: params.search || undefined,
      priceFrom: params.priceFrom || undefined,
      priceTo: params.priceTo || undefined,
      weightFrom: params.weightFrom || undefined,
      weightTo: params.weightTo || undefined,
      categorySlug: params.categorySlug || undefined,
      subcategorySlug: params.subcategorySlug || undefined,
      metals: params.metals?.length ? params.metals : undefined,
      sizes: params.sizes?.length ? params.sizes : undefined,
    },
  });

  return response.data;
}
