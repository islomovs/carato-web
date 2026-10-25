// next/image loader: MinIO uploads go through our resizer (src/app/api/img/route.ts),
// everything else (local /public assets) is served as-is.
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("https://minio.carato.uz/")) {
    return `/api/img?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
  }
  // Width param keeps srcset entries distinct; static files ignore it
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
