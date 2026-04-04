import SellerPageContent from "@/components/shared/seller/SellerPageContent";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SellerPageContent slug={slug} />;
}
