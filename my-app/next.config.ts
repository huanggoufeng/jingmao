import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Add bundle analyzer configuration
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
