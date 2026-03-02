import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ministorex/ui",
    "@ministorex/database",
    "@ministorex/utils",
  ],
};

export default nextConfig;
