import FeedbackSection from "@/components/shared/FeedbackSection";
import ProductAccordion from "@/components/shared/ProductAccordion";
import ProductGallery from "@/components/shared/ProductGallery";
import ProductInfo from "@/components/shared/ProductInfo";
import SellerInfoButton from "@/components/shared/SellerInfoButton";

export default function ProductDetailsPage() {
  return (
    <div className="w-full flex flex-row items-start px-8 my-[52px] overflow-hidden gap-[52px]">
      <div className="w-full h-full flex flex-col gap-8">
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
        <SellerInfoButton
          imageSrc="/images/banner-placeholder.jpg"
          title="JewelStore"
          rating={4}
          sellerUrl="/seller/jewelstore"
        />
        <ProductAccordion />
        <FeedbackSection
          overallRating={4.5}
          totalReviews={10}
          feedbacks={[
            {
              id: 1,
              userName: "John Doe",
              rating: 5,
              date: "2023-01-01",
              title: "Great product!",
              media: [
                {
                  id: 1,
                  src: "/images/news-placeholder.png",
                  type: "image",
                },
                {
                  id: 2,
                  src: "/images/category-placeholder.png",
                  type: "image",
                },
              ],
              description:
                "I really loved this product. It exceeded my expectations!",
            },
            {
              id: 2,
              userName: "Jane Smith",
              rating: 4,
              date: "2023-01-22",
              title: "Good value for money",
              description:
                "The product is good for the price. I would recommend it.",
            },
          ]}
        />
      </div>
      <ProductInfo />
    </div>
  );
}
