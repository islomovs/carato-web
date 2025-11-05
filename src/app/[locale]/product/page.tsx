import ProductGallery from "@/components/shared/ProductGallery";
import ProductInfo from "@/components/shared/ProductInfo";

export default function ProductDetailsPage() {
  return (
    <div className="w-full flex flex-row items-start px-8 my-[52px] overflow-hidden gap-[52px]">
      <ProductGallery
        variant="page"
        media={[
          {
            id: 1,
            type: "image",
            src: "/images/news-placeholder.png",
          },
          { id: 2, type: "video", src: "/videos/placeholder-video.mp4" },
          { id: 3, type: "image", src: "/images/category-placeholder.png" },
          { id: 4, type: "image", src: "/images/banner-placeholder.jpg" },
          { id: 5, type: "image", src: "/images/news-crafted-eternity.jpg" },
        ]}
      />
      <ProductInfo />
    </div>
  );
}
