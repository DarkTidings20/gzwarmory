import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/builder", destination: "/vendors", permanent: true },
      { source: "/builder/:path*", destination: "/vendors", permanent: true },
      { source: "/loadout", destination: "/vendors", permanent: true },
      { source: "/loadout/:path*", destination: "/vendors", permanent: true },
    ];
  },
};

export default nextConfig;
