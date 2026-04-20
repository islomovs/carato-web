import { useEffect } from "react";

export default function useLockScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // Measure scrollbar width before hiding it
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const html = document.documentElement;
    const body = document.body;

    // Use paddingRight (not marginRight) to compensate for the scrollbar
    // disappearing — this matches what Radix UI does and avoids layout shifts.
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
      // Set the same CSS variable that react-remove-scroll (Radix Dialog)
      // uses, so the fixed header padding rule in globals.css also fires
      // for our custom overlays (catalog, seller layer, etc.)
      html.style.setProperty(
        "--removed-body-scroll-bar-size",
        `${scrollbarWidth}px`
      );
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      html.style.removeProperty("--removed-body-scroll-bar-size");
    };
  }, [isLocked]);
}