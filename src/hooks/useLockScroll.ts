import { useEffect } from "react";

export default function useLockScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // lock scroll and add padding to prevent shifting
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [isLocked]);
}
