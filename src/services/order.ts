import api from "@/lib/axios/instance";

export type OrderProductPayload = {
  product: string; // slug
  size: number;
  quantity: number;
};

export type CreateOrderPayload = {
  phone: string;
  fullName: string;
  deliveryType: string;
  address: string;
  apartmentNumber?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
  deliveryPreferredTime?: string | null; // ISO string
  paymentType: string; // e.g. "CLICK"
  totalSum: number;
  deliveryPrice?: number;
  promocode?: string | null;
  products: OrderProductPayload[];
};

interface PaginatedOrderResponse {
  content: MyOrdersAll[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export type MyOrdersAll = {
  id: number;
  createdTime: string;
  status: string;
  checkoutUrl: string;
  isPaid: boolean;
  images: [
    {
      image: string;
    },
    {
      image: string;
    },
  ];
};

export interface MyOrderItem {
  id: number;
  createdTime: string;
  phone: string;
  fullName: string;
  deliveryType: string;
  address: string;
  apartmentNumber: string;
  entrance: string;
  floor: string;
  comment: string;
  deliveryPreferredTime: string;
  status: string;
  paymentType: string;
  isPaid: boolean;
  checkoutUrl: string;
  totalSum: number;
  promocode: {
    id: number;
    code: string;
    discountPrice: number;
    discountPercent: number;
  };
  products: [
    {
      unitPrice: number;
      unitDiscountPrice: number;
      unitDiscountPercent: number;
      totalPrice: number;
      quantity: number;
      product: {
        id: number;
        slug: string;
        name: string;
        images: [
          {
            image: string;
          },
        ];
        variants: [
          {
            size: {
              id: number;
              name: string;
            };
          },
        ];
      };
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreateOrderResponse = any; // adjust if you want strict typing

export async function createOrder(payload: CreateOrderPayload) {
  const res = await api.post("/api/v1/orders/create", payload);
  return res.data as CreateOrderResponse;
}

export async function getAllOrders(
  page: number,
  size: number,
  locale: string
): Promise<MyOrdersAll[]> {
  const response = await api.get<PaginatedOrderResponse>(`/api/v1/orders/all`, {
    params: { page, size },
    headers: { "Accept-Language": locale },
  });

  return response.data.content;
}

export async function getOrderById(id: number, locale: string) {
  const response = await api.get(`/api/v1/orders/${id}`, {
    headers: { "Accept-Language": locale },
  });
  return response.data as MyOrderItem;
}
