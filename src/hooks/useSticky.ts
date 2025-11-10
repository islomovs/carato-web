import { useEffect, useState } from "react";

export function useSticky(
  refTitle: React.RefObject<HTMLDivElement | null>,
  refBar: React.RefObject<HTMLDivElement | null>
) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (!refTitle.current || !refBar.current) return;
      const titleBottom = refTitle.current.getBoundingClientRect().bottom;
      setIsSticky(titleBottom <= 0);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [refTitle, refBar]);

  return isSticky;
}