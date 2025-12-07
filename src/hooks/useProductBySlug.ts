import { useState, useEffect } from "react";
import { getProductBySlug, Product } from "@/services/product";
import { useLocale } from "next-intl";

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug, locale)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, locale]);

  return { product, loading, error };
}
