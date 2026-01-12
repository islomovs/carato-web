import { useEffect } from "react";

export default function useLockScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.marginRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    };
  }, [isLocked]);
}
