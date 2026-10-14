import type { MetadataRoute } from "next";
import { servicos } from "@/content/servicos";
import { artigosOrdenados } from "@/lib/blog";

/** Uma página do site. `data` (AAAA-MM-DD) só nos artigos. */
export type Rota = { caminho: string; data?: string };

/** Todas as páginas do site: a fonte do sitemap. Página nova entra aqui e nos testes de rotas e de SEO. */
export const rotas: Rota[] = [
  { caminho: "/" },
  { caminho: "/servicos" },
  ...servicos.map((s) => ({ caminho: `/servicos/${s.slug}` })),
  { caminho: "/sobre" },
  { caminho: "/contato" },
  { caminho: "/blog" },
  ...artigosOrdenados.map((a) => ({ caminho: `/blog/${a.slug}`, data: a.metadata.data })),
];

/** As entradas do sitemap no domínio recebido. Sem data de hoje: o site sai pronto no build. */
export function entradasSitemap(siteUrl: string, lista: Rota[] = rotas): MetadataRoute.Sitemap {
  return lista.map(({ caminho, data }) => ({
    url: caminho === "/" ? siteUrl : `${siteUrl}${caminho}`,
    ...(data ? { lastModified: data } : {}),
  }));
}

/** O robots.txt: libera tudo e aponta o sitemap. */
export function regrasRobots(siteUrl: string): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
