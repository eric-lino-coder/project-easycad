import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL_BACK_END: process.env.NEXT_PUBLIC_BASE_URL_BACK_END,
  },
};

export default nextConfig;
