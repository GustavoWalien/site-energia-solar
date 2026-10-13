import type { NextConfig } from "next";

// O Tailwind entra pelo PostCSS (postcss.config.mjs), como manda a documentação do Next 16.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
