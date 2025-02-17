import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{hostname:"i.ytimg.com"},{hostname:"yt3.ggpht.com"}]
  }
};

export default nextConfig;
