import ProductSetPage from "@/components/layout/ProductSetPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductSetPage slug={slug} />;
}
