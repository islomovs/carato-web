/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { getOrderById, MyOrderItem } from "@/services/order";
import { useTranslations } from "next-intl";

export function useOrderById(orderId: number | null) {
  const t = useTranslations("profile");
  const [order, setOrder] = useState<MyOrderItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const locale = navigator.language || "ru";
        const data = await getOrderById(orderId, locale);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order by id", err);
        setError(t("loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
}
