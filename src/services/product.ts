/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios/instance";

export interface ProductVariant {
  size: { id: number; name: string };
  price: number;
  discountPrice: number;
  discountPercent: number;
  stockQuantity: number;
}

export interface CategorySize {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  characteristics: string;
  price: number;
  category: {
    id: number;
    name: string;
    slug: string;
    productSizes?: CategorySize[];
    /**
     * TODO: ask backend to add this field.
     * Drives which measurement guide to show in DetermineSizeModal.
     * Values: "ring" | "bracelet" | "necklace" | "clothing" | null
     */
    sizeGuideType?: string | null;
  };
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
  stockQuantity: number;
  metalPrice: number;
  oldPrice?: number | null;
  isPriceIncreased?: boolean | null;
  shopMarginPercent?: number | null;
  caratoMarginPercent?: number | null;
  seller: Seller;
}

export interface Seller {
  id: number;
  name: string;
  slug: string;
  ordersQuantity: number;
  reviewsQuantity: number;
  averageReviewRating: number;
  image: string;
  createdTime?: string;
}

export async function getProductBySlug(
  slug: string,
  locale: string,
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

export type SortOption =
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "CREATED_DESC"
  | "BEST_RATING_DESC";

export interface ProductsFilterParams {
  page: number;
  size: number;
  search?: string;
  priceFrom?: number;
  priceTo?: number;
  weightFrom?: number;
  weightTo?: number;
  catalogueSlug?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  metals?: number[];
  sizes?: number[];
  sortType?: SortOption;
  seller?: string;
}

export const INITIAL_FILTERS = {
  search: "",
  priceFrom: null as number | null,
  priceTo: null as number | null,
  weightFrom: null as number | null,
  weightTo: null as number | null,
  catalogueSlug: null as string | null,
  categorySlug: null as string | null,
  subcategorySlug: null as string | null,
  metals: [] as number[],
  sizes: [] as number[],
  sortType: null as SortOption | null,
  seller: null as string | null,
};

export async function fetchAllProducts(
  params: ProductsFilterParams,
  locale: string,
) {
  const response = await api.get("/api/v1/products/all", {
    headers: { "Accept-Language": locale },
    params: {
      page: params.page,
      size: params.size,
      search: params.search || undefined,
      priceFrom: params.priceFrom != null ? params.priceFrom : undefined,
      priceTo: params.priceTo != null ? params.priceTo : undefined,
      weightFrom: params.weightFrom != null ? params.weightFrom : undefined,
      weightTo: params.weightTo != null ? params.weightTo : undefined,
      catalogueSlug: params.catalogueSlug || undefined,
      categorySlug: params.categorySlug || undefined,
      subcategorySlug: params.subcategorySlug || undefined,
      metals: params.metals?.length ? params.metals : undefined,
      sizes: params.sizes?.length ? params.sizes : undefined,
      sortType: params.sortType || undefined,
      seller: params.seller != null ? params.seller : undefined,
    },
  });

  return response.data;
}
