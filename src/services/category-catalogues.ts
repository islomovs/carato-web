import api from "@/lib/axios/instance";

export interface CategoryCatalogue {
  id: number;
  createdTime: string;
  slug: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  categories: [
    {
      id: number;
      slug: string;
      name: string;
      mobileImage: string;
      desktopImage: string;
      isActive: boolean;
      isDeleted: boolean;
      showOnMainPage: boolean;
    },
  ];
}

export interface CategoryCatalogueBySlug {
  id: number;
  slug: string;
  name: string;
  categories: [
    {
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
          mobileImage: string | null;
          desktopImage: string | null;
        },
      ];
    },
  ];
}

export async function getCategoryCatalogues(locale: string) {
  const response = await api.get<CategoryCatalogue[]>(
    "api/v1/category-catalogues/all",
    {
      headers: {
        "Accept-Language": locale,
      },
    }
  );
  return response.data;
}

export async function getCategoryCatalogueBySlug(slug: string, locale: string) {
  const response = await api.get<CategoryCatalogueBySlug>(
    `api/v1/category-catalogues/${slug}`,
    {
      headers: { "Accept-Language": locale },
    }
  );
  return response.data;
}
