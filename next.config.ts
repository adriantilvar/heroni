import type { NextConfig } from "next";

import "@/env/client.ts";
import "@/env/server.ts";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
