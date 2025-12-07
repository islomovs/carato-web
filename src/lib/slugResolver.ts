import { Category } from "@/services/categories";

export function resolveSlugType(slug: string, categories: Category[]) {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return { type: "categorySlug", value: slug, label: cat.name };
    }

    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.slug === slug) {
          return { type: "subcategorySlug", value: slug, label: sub.name };
        }
      }
    }
  }

  // fallback
  return { type: "categorySlug", value: slug, label: slug };
}
