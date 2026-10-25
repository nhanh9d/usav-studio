import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/vi", permanent: false },
      // The booster's old legal pages were replaced by the site-wide ones.
      { source: "/booster/terms", destination: "/en/terms-of-service", permanent: true },
      { source: "/booster/privacy", destination: "/en/privacy-policy", permanent: true },
    ];
  },
  // Account Booster product images are hosted on external CDNs.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
