// app/[locale]/page.tsx (or wherever your Home is)

import BannerCarousel from "@/components/layout/BannerCarousel";
import ProductsBlock from "@/components/layout/ProductsBlock";
import CategoriesBlock from "@/components/layout/CategoriesBlock";
import NewsSection from "@/components/layout/NewsSection";
import CollectionsSection from "@/components/layout/CollectionsSection";
import StoriesSection from "@/components/shared/stories/StoriesSection";
import { getProductSets } from "@/services/productSets";
import { getProductsBySet } from "@/services/productSetProducts";
import { getLocale } from "next-intl/server";
import {} from "@/services/stories";

export default async function Home() {
  const locale = await getLocale();

  const sets = await getProductSets(locale);

  const [firstSet, secondSet, thirdSet] = sets;

  const [firstProducts, secondProducts, thirdProducts] = await Promise.all([
    firstSet ? getProductsBySet(firstSet.slug, 1, 10, locale) : [],
    secondSet ? getProductsBySet(secondSet.slug, 1, 10, locale) : [],
    thirdSet ? getProductsBySet(thirdSet.slug, 1, 10, locale) : [],
  ]);

  console.log("firstProducts", firstProducts, "secondProducts", secondProducts, "thirdProducts", thirdProducts);

  return (
    <div className="w-full h-full text-center pt-16 md:pt-0">
      <BannerCarousel />
      <StoriesSection />

      {firstSet && (
        <ProductsBlock
          slug={firstSet.slug}
          title={firstSet.name}
          products={firstProducts}
        />
      )}
      <CollectionsSection />

      {secondSet && (
        <ProductsBlock
          slug={secondSet.slug}
          title={secondSet.name}
          products={secondProducts}
        />
      )}
      <CategoriesBlock />

      {thirdSet && (
        <ProductsBlock
          slug={thirdSet.slug}
          title={thirdSet.name}
          products={thirdProducts}
          layout="grid"
        />
      )}

      <NewsSection />
    </div>
  );
}
