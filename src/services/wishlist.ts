import api from "@/lib/axios/instance";

export type WishlistItem = {
  id: number;
  slug: string;
  name: string;
  stockQuantity: number;
  price: number;
  category: { id: number; name: string; slug: string };
  discountPrice: number;
  discountPercent: number;
  images: {
    image: string;
  }[];
  variants: {
    size: {
      id: number;
      name: string;
    };
    stockQuantity: number;
    price: number;
    discountPrice: number;
    discountPercent: number;
  }[];
};

export async function addToWishlist(
  product: string,
  size: number
): Promise<void> {
  await api.post("/api/v1/wishlist/add", null, {
    params: {
      product,
      size,
    },
  });
}

export async function getWishlistAll(locale?: string): Promise<WishlistItem[]> {
  const response = await api.get<WishlistItem[]>("/api/v1/wishlist/all", {
    headers: locale ? { "Accept-Language": locale } : undefined,
  });

  return response.data;
}

export async function removeFromWishlist(
  product: string,
  size: number
): Promise<void> {
  await api.delete("/api/v1/wishlist/remove", {
    params: {
      product,
      size,
    },
  });
}

export async function clearWishlist(): Promise<void> {
  await api.delete("/api/v1/wishlist/removeAll");
}
