import { useTranslations } from "next-intl";
import BannerCarousel from "@/components/layout/BannerCarousel";
import ProductsBlock from "@/components/layout/ProductsBlock";
import CategoriesBlock from "@/components/layout/CategoriesBlock";
import NewsSection from "@/components/layout/NewsSection";
import CollectionsSection from "@/components/layout/CollectionsSection";

export default function Home() {
  const t = useTranslations("home");

  const sampleProducts = [
    {
      id: 1,
      title: "Riche Coffee Scrub",
      price: 89000,
      image: "/images/product-placeholder.png",
      description: "Natural coffee scrub for smooth skin",
    },
    {
      id: 2,
      title: "The Ordinary Niacinamide 10% + Zinc 1%",
      price: 135000,
      image: "/images/product-placeholder.png",
      description: "Balances sebum and minimizes pores",
    },
    {
      id: 3,
      title: "Riche Enzyme Powder Cleanser",
      price: 119000,
      image: "/images/product-placeholder.png",
      description: "Gentle powder cleanser with enzymes",
    },
    {
      id: 4,
      title: "The Ordinary Hyaluronic Acid 2% + B5",
      price: 125000,
      image: "/images/product-placeholder.png",
      description: "Deep hydration and smooth texture",
    },
    {
      id: 11,
      title: "2Riche Coffee Scrub",
      price: 89000,
      image: "/images/product-placeholder.png",
      description: "Natural coffee scrub for smooth skin",
    },
    {
      id: 12,
      title: "2The Ordinary Niacinamide 10% + Zinc 1%",
      price: 135000,
      image: "/images/product-placeholder.png",
      description: "Balances sebum and minimizes pores",
    },
    {
      id: 13,
      title: "2Riche Enzyme Powder Cleanser",
      price: 119000,
      image: "/images/product-placeholder.png",
      description: "Gentle powder cleanser with enzymes",
    },
    {
      id: 14,
      title: "2The Ordinary Hyaluronic Acid 2% + B5",
      price: 125000,
      image: "/images/product-placeholder.png",
      description: "Deep hydration and smooth texture",
    },
  ];

  const categories = [
    { id: 1, title: "Face Care", image: "/images/category-placeholder.png" },
    { id: 2, title: "Body Care", image: "/images/category-placeholder.png" },
    { id: 3, title: "Hair Care", image: "/images/category-placeholder.png" },
    { id: 4, title: "Sunscreens", image: "/images/category-placeholder.png" },
    { id: 5, title: "Accessories", image: "/images/category-placeholder.png" },
    { id: 6, title: "Gift Sets", image: "/images/category-placeholder.png" },
  ];

  const sampleNews = [
    {
      id: 1,
      title: "New Collection Launch",
      description: "Discover our latest skincare arrivals.",
      date: "October 10, 2025",
      image: "/images/news-placeholder.png",
    },
    {
      id: 2,
      title: "Autumn Sale Is Here",
      description: "Up to 30% off your favorite brands.",
      date: "October 8, 2025",
      image: "/images/news-placeholder.png",
    },
    {
      id: 3,
      title: "Behind The Brand",
      description: "Learn about our sustainable sourcing.",
      date: "October 5, 2025",
      image: "/images/news-placeholder.png",
    },
    {
      id: 4,
      title: "Tips For Better Skincare",
      description: "Simple habits that improve your skin health.",
      date: "October 2, 2025",
      image: "/images/news-placeholder.png",
    },
    {
      id: 5,
      title: "Customer Favorites",
      description: "The most-loved products this month.",
      date: "September 29, 2025",
      image: "/images/news-placeholder.png",
    },
    {
      id: 6,
      title: "How To Layer Serums",
      description: "A quick guide for maximum effect.",
      date: "September 25, 2025",
      image: "/images/news-placeholder.png",
    },
  ];

  return (
    <div className="w-full h-full text-center">
      <BannerCarousel />
      <ProductsBlock title={t("popularProducts")} products={sampleProducts} />
      <CollectionsSection />
      <ProductsBlock title={t("newArrivals")} products={sampleProducts} />
      <CategoriesBlock categories={categories} />
      <ProductsBlock
        title={t("specialOffers")}
        products={sampleProducts}
        layout="grid"
      />
      <NewsSection news={sampleNews} />
    </div>
  );
}
