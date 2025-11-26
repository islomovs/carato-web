/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "@/lib/axios/instance";
import { debounce } from "./debounce";

interface CartVariant {
  size: { id: number; name: string };
  stockQuantity: number;
}

export interface CartItem {
  product: {
    id: number;
    slug: string;
    name: string;
    stockQuantity: number;
    price: number;
    discountPrice?: number;
    discountPercent?: number;
    images: { image: string }[];
    variants: CartVariant[];
  };
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (slug: string, sizeId: number, quantity?: number) => Promise<void>;
  updateQuantity: (
    slug: string,
    sizeId: number,
    quantity: number
  ) => Promise<void>;
  decrementItem: (slug: string, sizeId: number) => Promise<void>;
  removeItem: (slug: string, sizeId: number) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
  // --- Debounced quantity sync to backend ---
  const syncQuantity = debounce(
    async (slug: string, sizeId: number, quantity: number) => {
      try {
        await api.post("/api/v1/basket/add", null, {
          params: { product: slug, size: sizeId, quantity },
        });
      } catch (err) {
        console.error("Sync error:", err);
      }
    },
    500 // wait 0.5 sec after last click
  );

  return {
    cartItems: [],
    loading: false,
    error: null,

    /** GET CART */
    fetchCart: async () => {
      set({ loading: true, error: null });
      try {
        const res = await api.get("/api/v1/basket/all");
        set({ cartItems: res.data, loading: false });
      } catch (err: any) {
        set({
          error: err.message || "Failed to fetch cart",
          loading: false,
        });
      }
    },

    /** ADD / INCREMENT */
    /** ADD / INCREMENT */
    addToCart: async (slug, sizeId, quantity = 1) => {
      const cart = get().cartItems;

      // FIND if item exists
      const existing = cart.find(
        (i) =>
          i.product.slug === slug &&
          i.product.variants.some((v) => v.size.id === sizeId)
      );

      let updatedCart: CartItem[];

      if (existing) {
        // 🔼 Increment quantity
        updatedCart = cart.map((item) =>
          item.product.slug === slug &&
          item.product.variants.some((v) => v.size.id === sizeId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // ➕ Add a NEW item
        const productRes = await api.get(`/api/v1/products/${slug}`);
        const product = productRes.data;

        const variant = product.variants.find((v: any) => v.size.id === sizeId);

        updatedCart = [
          ...cart,
          {
            product,
            quantity,
          },
        ];
      }

      set({ cartItems: updatedCart });

      // 🔄 Sync to backend (debounced)
      const item = updatedCart.find(
        (i) =>
          i.product.slug === slug &&
          i.product.variants.some((v) => v.size.id === sizeId)
      );

      if (item) syncQuantity(slug, sizeId, item.quantity);

      return true; // 🔥 now UI will detect success
    },

    /** DECREMENT */
    decrementItem: async (slug, sizeId) => {
      const cart = get().cartItems;

      const updatedCart = cart
        .map((item) => {
          if (
            item.product.slug === slug &&
            item.product.variants[0].size.id === sizeId
          ) {
            return { ...item, quantity: Math.max(1, item.quantity - 1) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      set({ cartItems: updatedCart });

      const item = updatedCart.find(
        (i) =>
          i.product.slug === slug && i.product.variants[0].size.id === sizeId
      );

      if (item) {
        syncQuantity(slug, sizeId, item.quantity);
      }
    },

    updateQuantity: async (slug, sizeId, quantity) => {
      const cart = get().cartItems;

      const updatedCart = cart.map((item) =>
        item.product.slug === slug &&
        item.product.variants.some((v) => v.size.id === sizeId)
          ? { ...item, quantity }
          : item
      );

      set({ cartItems: updatedCart });

      // sync to backend
      syncQuantity(slug, sizeId, quantity);
    },

    /** REMOVE ITEM */
    removeItem: async (slug, sizeId) => {
      const cart = get().cartItems;

      const updatedCart = cart.filter(
        (item) =>
          !(
            item.product.slug === slug &&
            item.product.variants[0].size.id === sizeId
          )
      );

      set({ cartItems: updatedCart });

      try {
        await api.delete("/api/v1/basket/remove", {
          params: { product: slug, size: sizeId },
        });
      } catch (err) {
        console.error("Remove error:", err);
      }
    },
  };
});
