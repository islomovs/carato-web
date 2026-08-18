import api from "@/lib/axios/instance";

export interface PromocodeResult {
  promocodeDiscountPercent: number;
  promocodeDiscountAmount: number;
  finalPrice: number;
}

export async function calculatePromocode(
  promocode: string,
  orderPrice: number
): Promise<PromocodeResult> {
  const res = await api.get("/api/v1/promocodes/calculate-order-price", {
    params: { promocode, orderPrice },
  });
  return res.data as PromocodeResult;
}
