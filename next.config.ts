import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 注：未启用 cacheComponents / partialPrefetching，
  // 因为 M4 的 API 路由（/api/checkout、/api/order/[id]、/api/pay/*）需要动态执行。
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
