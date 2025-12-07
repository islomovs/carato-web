/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios/instance";

export interface Feedback {
  createdTime: string;
  text: string;
  rating: number;
  user: {
    id: number;
    fullName: string;
  };
  media: { src: string }[];
}

export interface FeedbackResponse {
  content: Feedback[];
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

export async function getProductFeedbackBySlug(
  slug: string,
  locale: string,
  page: number,
  size: number
): Promise<FeedbackResponse> {
  try {
    const response = await api.get<FeedbackResponse>(
      `/api/v1/product-feedbacks/${slug}`,
      {
        params: {
          page,
          size,
        },
        headers: { "Accept-Language": locale },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("🔥 API ERROR (getProductFeedbackBySlug):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });
    throw error;
  }
}

export async function submitProductFeedback(
  payload: {
    product: string;
    text: string;
    rating: number;
  },
  locale: string
): Promise<void> {
  try {
    await api.post(
      `/api/v1/product-feedbacks/feedback`,
      {
        product: payload.product,
        text: payload.text,
        rating: payload.rating,
      },
      {
        headers: { "Accept-Language": locale },
      }
    );
  } catch (error: any) {
    console.error("🔥 API ERROR (submitProductFeedback):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });
    throw error;
  }
}
