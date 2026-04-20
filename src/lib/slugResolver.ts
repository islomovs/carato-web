import { CategoryCatalogue } from "@/services/category-catalogues";

export function resolveSlugType(slug: string, catalogues: CategoryCatalogue[]) {
  for (const catalogue of catalogues) {
    // Level 1 — catalogue
    if (catalogue.slug === slug) {
      return { type: "catalogueSlug", value: slug, label: catalogue.name };
    }

    // Level 2 — category
    for (const cat of catalogue.categories ?? []) {
      if (cat.slug === slug) {
        return { type: "categorySlug", value: slug, label: cat.name };
      }
    }
  }

  // Level 3 — subcategory not in list response, label resolved separately
  return { type: "subcategorySlug", value: slug, label: null };
}
