/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import api, { AUTH_LOGOUT_EVENT } from "@/lib/axios/instance";
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
      const items: WishlistItem[] = res.data;
      set({ items, loading: false });

      // The wishlist API doesn't return isPriceIncreased (drives the price up/down arrow on cards);
      // fill it in from each product's details. Skipped for items that already have it.
      const missing = items.filter((i) => i.isPriceIncreased === undefined);
      if (missing.length === 0) return;
      const trends = new Map<string, boolean | null>();
      await Promise.all(
        missing.map(async (i) => {
          try {
            const { data } = await api.get(`/api/v1/products/${i.slug}`, {
              headers: { "Accept-Language": locale },
            });
            trends.set(i.slug, data?.isPriceIncreased ?? null);
          } catch {
            // no arrow for this card
          }
        }),
      );
      set({
        items: get().items.map((i) =>
          trends.has(i.slug) ? { ...i, isPriceIncreased: trends.get(i.slug) } : i,
        ),
      });
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

// Wipe the wishlist when the user logs out / the session expires
if (typeof window !== "undefined") {
  window.addEventListener(AUTH_LOGOUT_EVENT, () => {
    useWishlistStore.setState({ items: [], error: null, loading: false });
  });
}
