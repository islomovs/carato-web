"use client";

import { useEffect, useState } from "react";
import { getUserInfo, UserInfo } from "@/services/user";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError("Failed to load user info");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
}
