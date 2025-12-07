/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getAllOrders, MyOrdersAll } from "@/services/order";
import { useTranslations, useLocale } from "next-intl";

interface UseMyOrdersReturn {
  orders: MyOrdersAll[] | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useMyOrders(page = 1, size = 10): UseMyOrdersReturn {
  const t = useTranslations("profile");
  const [orders, setOrders] = useState<MyOrdersAll[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllOrders(page, size, locale);
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to fetch orders", err);
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, size]);

  return { orders, loading, error, reload: fetchOrders };
}
