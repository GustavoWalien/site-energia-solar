import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// O Tailwind entra pelo PostCSS (postcss.config.mjs), como manda a documentação do Next 16.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

// Os artigos do blog são .mdx importados por content/blog/index.ts. No Turbopack, os plugins vão pelo nome.
const comMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default comMDX(nextConfig);
