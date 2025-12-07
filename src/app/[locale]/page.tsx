import BannerCarousel from "@/components/layout/BannerCarousel";
import ProductsBlock from "@/components/layout/ProductsBlock";
import CategoriesBlock from "@/components/layout/CategoriesBlock";
import NewsSection from "@/components/layout/NewsSection";
import CollectionsSection from "@/components/layout/CollectionsSection";
import StoriesSection from "@/components/layout/StoriesComponent";
import { getProductSets } from "@/services/productSets";
import { getProductsBySet } from "@/services/productSetProducts";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  const locale = "ru";

  const sets = await getProductSets(locale);

  // Map your needed sets
  const bestsellersSet = sets.find((x) => x.slug === "bestsellers");
  const expensiveSet = sets.find((x) => x.slug === "expensive");
  const priceMore20kSet = sets.find((x) => x.slug === "priceIsMoreThan20000");

  // 2. Fetch product blocks in parallel
  const [popularProducts, newArrivals, specialOffers] = await Promise.all([
    bestsellersSet
      ? getProductsBySet(bestsellersSet.slug, 1, 8, locale)
      : Promise.resolve([]),

    priceMore20kSet
      ? getProductsBySet(priceMore20kSet.slug, 1, 8, locale)
      : Promise.resolve([]),

    expensiveSet
      ? getProductsBySet(expensiveSet.slug, 1, 8, locale)
      : Promise.resolve([]),
  ]);

  return (
    <div className="w-full h-full text-center">
      <BannerCarousel />
      <StoriesSection />

      <ProductsBlock title={t("popularProducts")} products={popularProducts} />
      <CollectionsSection />
      <ProductsBlock title={t("newArrivals")} products={newArrivals} />
      <CategoriesBlock />
      <ProductsBlock
        title={t("specialOffers")}
        products={specialOffers}
        layout="grid"
      />
      <NewsSection />
    </div>
  );
}
