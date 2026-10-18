import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { useIsAuthenticated } from "@/lib/authStore";
import IconButton from "./IconButton";

import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useAuthModalStore } from "@/lib/authModalStore";

type HeaderIconsProps = {
  setSearchOpen: () => void;
};

export default function HeaderIcons({ setSearchOpen }: HeaderIconsProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const cartCount = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.totalCount());

  const { openAuth } = useAuthModalStore();

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Search */}
      <IconButton
        icon="/icons/search.svg"
        onClick={setSearchOpen}
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
        onClick={() =>
          isAuthenticated ? router.push("/wishlist") : openAuth()
        }
      />

      {/* Profile */}
      <IconButton
        icon="/icons/user.svg"
        onClick={() => (isAuthenticated ? router.push("/profile") : openAuth())}
      />

      <LanguageSwitcher />
    </div>
  );
}
