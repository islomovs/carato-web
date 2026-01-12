/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api from "@/lib/axios/instance";
import { WishlistItem } from "@/services/wishlist";

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;

  fetchWishlist: (locale: string) => Promise<void>;
  add: (slug: string, locale: string) => Promise<void>;
  remove: (slug: string) => Promise<void>;
  clear: () => Promise<void>;

  totalCount: () => number;
  isInWishlist: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  /** GET ALL */
  fetchWishlist: async (locale) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/v1/wishlist/all", {
        headers: { "Accept-Language": locale },
      });
      set({ items: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  /** ADD */
  add: async (slug, locale) => {
    set({ loading: true });
    console.log("Adding to wishlist:", slug);
    try {
      await api.post("/api/v1/wishlist/add", null, {
        params: { product: slug },
      });

      // optimistic update
      await get().fetchWishlist(locale);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /** REMOVE */
  remove: async (slug) => {
    set({ loading: true });
    try {
      await api.delete("/api/v1/wishlist/remove", {
        params: { product: slug },
      });

      set({
        items: get().items.filter((i) => !(i.slug === slug)),
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /** CLEAR */
  clear: async () => {
    set({ loading: true });
    try {
      await api.delete("/api/v1/wishlist/clear");
      set({ items: [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /** HELPERS */
  totalCount: () => get().items.length,

  isInWishlist: (slug) => get().items.some((i) => i.slug === slug),
}));
