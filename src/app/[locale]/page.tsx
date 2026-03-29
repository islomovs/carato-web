// app/[locale]/page.tsx (or wherever your Home is)

import BannerCarousel from "@/components/layout/BannerCarousel";
import ProductsBlock from "@/components/layout/ProductsBlock";
import CategoriesBlock from "@/components/layout/CategoriesBlock";
import NewsSection from "@/components/layout/NewsSection";
import CollectionsSection from "@/components/layout/CollectionsSection";
import StoriesSection from "@/components/layout/StoriesComponent";
import { getProductSets } from "@/services/productSets";
import { getProductsBySet } from "@/services/productSetProducts";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();

  const sets = await getProductSets(locale);

  const [firstSet, secondSet, thirdSet] = sets;

  const [firstProducts, secondProducts, thirdProducts] = await Promise.all([
    firstSet ? getProductsBySet(firstSet.slug, 1, 10, locale) : [],
    secondSet ? getProductsBySet(secondSet.slug, 1, 10, locale) : [],
    thirdSet ? getProductsBySet(thirdSet.slug, 1, 10, locale) : [],
  ]);

  return (
    <div className="w-full h-full text-center pt-[66px] md:pt-0">
      <BannerCarousel />
      <StoriesSection />

      {firstSet && (
        <ProductsBlock title={firstSet.name} products={firstProducts} />
      )}
      <CollectionsSection />

      {secondSet && (
        <ProductsBlock title={secondSet.name} products={secondProducts} />
      )}
      <CategoriesBlock />

      {thirdSet && (
        <ProductsBlock
          title={thirdSet.name}
          products={thirdProducts}
          layout="grid"
        />
      )}

      <NewsSection />
    </div>
  );
}
