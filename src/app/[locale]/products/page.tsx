"use client";

import CatalogPage from "@/components/layout/CatalogPage";
import { usePathname } from "next/navigation";

export default function CatalogPageWrapper() {
  const pathname = usePathname();
  const slugFromUrl = pathname.split("/").pop();

  return <CatalogPage slug={slugFromUrl} />;
}
