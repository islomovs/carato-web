import api from "@/lib/axios/instance";

export interface Collection {
  id: number;
  slug: string;
  title: string;
  mobileImage: string;
  desktopImage: string;
}

export interface CollectionBannerProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPercent: number;
  inWishlist: boolean;
  category: { id: number; name: string; slug: string };
  subcategory: { id: number; name: string; slug: string };
  images: { image: string }[];
}

export interface CollectionBanner {
  id: number;
  image: string;
  /** 1 = single-cell banner  2 = double-row / featured banner */
  rowNumber: 1 | 2;
  products: CollectionBannerProduct[];
}

export interface CollectionDetail {
  id: number;
  slug: string;
  title: string;
  description: string;
  mobileImage: string;
  desktopImage: string;
  banners: CollectionBanner[];
}

export interface CollectionProductsResponse {
  content: CollectionBannerProduct[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
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

export async function getCollectionBySlug(
  slug: string,
  locale: string
): Promise<CollectionDetail> {
  const response = await api.get<CollectionDetail>(
    `/api/v1/catalogue-collections/${slug}`,
    { headers: { "Accept-Language": locale } }
  );
  return response.data;
}

export async function getCollectionProducts(
  slug: string,
  page: number,
  size: number,
  locale: string
): Promise<CollectionProductsResponse> {
  const response = await api.get<CollectionProductsResponse>(
    `/api/v1/catalogue-collections/${slug}/products`,
    {
      headers: { "Accept-Language": locale },
      params: { page: page - 1, size }, // API is 0-indexed
    }
  );
  return response.data;
}
