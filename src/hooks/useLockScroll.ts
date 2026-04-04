import { useEffect } from "react";

export default function useLockScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.marginRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.marginRight = "";
    };
  }, [isLocked]);
}