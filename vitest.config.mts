import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // os testes do blog importam os .mdx de verdade
  plugins: [mdx({ remarkPlugins: [remarkGfm] })],
  resolve: { alias: [{ find: /^@\//, replacement: root }] },
  test: { include: ["tests/unit/**/*.test.{ts,tsx}"], environment: "node" },
});
