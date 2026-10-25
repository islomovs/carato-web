import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // MinIO originals are 2–8 MB JPEGs; resize them to WebP per device via /api/img.
    // Next's built-in optimizer can't be used: it aborts origin downloads after 7s.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // Cap at 1920px: many <Image fill> usages have no `sizes`, which would otherwise request 3840px
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio.carato.uz",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
