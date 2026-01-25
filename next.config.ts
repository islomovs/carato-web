import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "162.19.220.41",
        port: "9000",
        pathname: "/carato/**",
      },
      {
        protocol: "https",
        hostname: "minio.carato.uz",
        pathname: "/carato/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
