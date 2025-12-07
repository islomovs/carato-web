/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useCreateOrder.ts
import { useState, useCallback } from "react";
import {
  createOrder,
  CreateOrderPayload,
  CreateOrderResponse,
} from "@/services/order";

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const create = useCallback(async (payload: CreateOrderPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data: CreateOrderResponse = await createOrder(payload);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    createOrder: create,
    loading,
    error,
  };
}
