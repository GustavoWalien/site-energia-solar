// Cada artigo .mdx exporta metadata, além do componente padrão que o @types/mdx já declara.
declare module "*.mdx" {
  import type { MetadadosArtigo } from "@/content/tipos";
  export const metadata: MetadadosArtigo;
}
