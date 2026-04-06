import MobileCatalogPage from "@/components/layout/MobileCatalogPage";

export default function Page() {
  return (
    <>
      {/* Mobile only */}
      <div className="md:hidden">
        <MobileCatalogPage />
      </div>
      {/* Desktop — your existing catalog */}
      <div className="hidden md:block">{/* existing desktop catalog */}</div>
    </>
  );
}
