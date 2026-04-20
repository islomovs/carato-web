import CollectionPage from "@/components/layout/CollectionPage";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CollectionPage slug={slug} />;
}
