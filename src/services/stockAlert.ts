import { api } from "@/lib/axios/instance";

export interface StockAlertSubscriptionPayload {
  customerPhone: string;
  product: number;
  productSize: number;
}

export async function createStockAlertSubscription(
  payload: StockAlertSubscriptionPayload,
): Promise<void> {
  await api.post("/api/v1/stock-alert-subscriptions", payload);
}
