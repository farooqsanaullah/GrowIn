import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "", // leaving empty for default
        pathname: "/**", // allows all paths
      },
      // We can add more patterns here for other hosts
    ],
  },
};

export default nextConfig;
