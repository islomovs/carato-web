import { api } from "@/lib/axios/instance";

export interface FeedbackMedia {
  image: string;
}

export interface FeedbackUser {
  id: number;
  fullName: string;
}

export interface FeedbackProduct {
  id: number;
  createdTime: string;
  slug: string;
  name: string;
  price: number;
  discountPercent: number;
  inWishlist: boolean;
  category: { id: number; name: string; slug: string };
  subcategory: { id: number; name: string; slug: string };
  images: { image: string }[];
}

export interface Feedback {
  createdTime: string;
  title: string;
  description: string;
  rating: number;
  media: FeedbackMedia[];
  user: FeedbackUser;
}

export interface MyFeedback {
  createdTime: string;
  title: string;
  description: string;
  rating: number;
  product: FeedbackProduct;
  media: FeedbackMedia[];
}

export interface FeedbackResponse {
  content: Feedback[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

// GET /api/v1/product-feedbacks/{slug}
export async function getProductFeedbackBySlug(
  slug: string,
  locale: string,
  page: number,
  size: number,
): Promise<Feedback[]> {
  const response = await api.get<FeedbackResponse>(
    `/api/v1/product-feedbacks/${slug}`,
    { params: { page, size }, headers: { "Accept-Language": locale } },
  );
  return response.data.content;
}

// GET /api/v1/users/product-feedbacks
// GET /api/v1/users/product-feedbacks
export async function getMyFeedbacks(
  page: number,
  size: number,
  locale: string
): Promise<MyFeedback[]> {
  const response = await api.get<PageableResponse<MyFeedback>>(
    `/api/v1/users/product-feedbacks`,
    { params: { page, size }, headers: { "Accept-Language": locale } }
  );
  return response.data.content; // unwrap .content
}

// Add PageableResponse if not already in the file:
interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

// POST /api/v1/product-feedbacks/feedback
export interface SubmitFeedbackPayload {
  product: string;
  title: string;
  description: string;
  rating: number;
  media?: { media: string; sortOrder: number }[];
}

export async function submitProductFeedback(
  payload: SubmitFeedbackPayload,
  locale: string,
): Promise<void> {
  await api.post(`/api/v1/product-feedbacks/feedback`, payload, {
    headers: { "Accept-Language": locale },
  });
}
