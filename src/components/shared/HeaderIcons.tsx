import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { getTokenPair } from "@/lib/axios/instance";
import IconButton from "./IconButton";

import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";

type HeaderIconsProps = {
  setAuthOpen: (val: boolean) => void;
  setSearchOpen?: (val: boolean) => void;
};

export default function HeaderIcons({
  setAuthOpen,
  setSearchOpen,
}: HeaderIconsProps) {
  const router = useRouter();
  const isAuthenticated = Boolean(getTokenPair().token);

  const cartCount = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.totalCount());

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Search */}
      <IconButton
        icon="/icons/search.svg"
        onClick={() => setSearchOpen?.(true)}
      />

      {/* Cart */}
      <IconButton
        icon="/icons/shopping-bag.svg"
        badge={cartCount}
        onClick={() => router.push("/cart")}
      />

      {/* Wishlist */}
      <IconButton
        icon="/icons/heart.svg"
        badge={wishlistCount}
        onClick={() => router.push("/wishlist")}
      />

      {/* Profile */}
      <IconButton
        icon="/icons/user.svg"
        onClick={() =>
          isAuthenticated ? router.push("/profile") : setAuthOpen(true)
        }
      />

      <LanguageSwitcher />
    </div>
  );
}
