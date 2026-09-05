import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only badge -- moved off bottom-left so it stops sitting on top of the
  // footer's nav links while testing. Never appears in production builds.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
