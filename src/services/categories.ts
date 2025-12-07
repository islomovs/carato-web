import api from "@/lib/axios/instance";

export interface Category {
  id: number;
  slug: string;
  name: string;
  mobileImage: string;
  desktopImage: string;
  subcategories: [
    {
      id: number;
      slug: string;
      name: string;
      mobileImage: string;
      desktopImage: string;
    },
  ];
}

export async function getCategories(locale: string) {
  const response = await api.get<Category[]>("api/v1/categories/all", {
    headers: {
      "Accept-Language": locale,
    },
  });
  return response.data;
}

export async function getCategoryBySlug(slug: string, locale: string) {
  const response = await api.get<Category>(`api/v1/categories/${slug}`, {
    headers: {
      "Accept-Language": locale,
    },
  });
  return response.data;
}
