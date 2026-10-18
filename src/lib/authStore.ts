"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";

const TOKEN_KEY = "auth_token";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

/**
 * Reactive login state. Updated by setTokenPair / clearTokenPair in
 * lib/axios/instance.ts, so every component re-renders the moment the user
 * logs in or out (instead of reading localStorage once per render).
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated:
    typeof window !== "undefined" && Boolean(localStorage.getItem(TOKEN_KEY)),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));

// Keep tabs in sync (logging out in one tab logs out the others)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === TOKEN_KEY || e.key === null) {
      useAuthStore.setState({
        isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
      });
    }
  });
}

/**
 * `ready` is false during SSR / the first client render (localStorage isn't
 * readable on the server), so pages can wait before redirecting.
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return { ready, isAuthenticated: ready && isAuthenticated };
}

/** Logged in? (false until mounted, to avoid hydration mismatches) */
export function useIsAuthenticated() {
  return useAuthStatus().isAuthenticated;
}
