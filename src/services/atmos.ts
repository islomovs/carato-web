import api from "@/lib/axios/instance";

export interface AtmosCreatePaymentResponse {
  checkoutUrl?: string;
  redirectUrl?: string;
  [key: string]: unknown;
}

/**
 * Initiates an Atmos redirect payment for the given order ID.
 * Calls POST /api/v1/atmos/pay/create/{id}
 * Returns the response which contains a redirect/checkout URL.
 */
export async function createAtmosPayment(
  orderId: number
): Promise<AtmosCreatePaymentResponse> {
  const res = await api.post(`/api/v1/atmos/pay/create/${orderId}`);
  return res.data as AtmosCreatePaymentResponse;
}
