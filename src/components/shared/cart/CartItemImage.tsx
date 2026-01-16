import { CartItem } from "@/lib/cartStore";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlistStore";

export default function CartItemImage({
  item,
  onToggleWishlist,
}: {
  item: CartItem;
  onToggleWishlist: () => void;
}) {
  const { items: wishlist } = useWishlistStore();

  const inWishlist = wishlist.some((w) => w.slug === item.product.slug);

  return (
    <div className="relative w-20 md:w-[164px] h-20 md:h-[164px] flex items-center justify-center bg-gray-50">
      <Image
        src={
          item.product.images?.[0]?.image || "/images/product-placeholder.png"
        }
        alt={item.product.name}
        width={164}
        height={164}
        className="object-cover w-full h-full"
      />

      {/* Wishlist (top-left) */}
      <button
        onClick={onToggleWishlist}
        className="absolute top-0 left-0 md:hidden w-5 h-5"
      >
        <Image
          src={inWishlist ? "/icons/heart-filled.svg" : "/icons/heart.svg"}
          alt="Wishlist"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
