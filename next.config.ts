import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL_BACK_END: process.env.BASE_URL_BACK_END,
  },
};

export default nextConfig;
