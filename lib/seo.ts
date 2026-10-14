import type { Metadata } from "next";
import { empresa } from "@/content/empresa";
import type { Seo } from "@/content/tipos";

/** A imagem de compartilhamento da Início (app/opengraph-image.png, gerada por scripts/og.mjs). */
export const IMAGEM_PADRAO = { url: "/opengraph-image.png", width: 1200, height: 630, alt: empresa.seo.imagemAlt };

export type OpcoesMetadados = {
  /** Endereço da página, ex.: "/sobre". Vira o canônico e o og:url. Sem ele (a 404), a página fica sem canônico. */
  caminho?: string;
  /** Artigo do blog: og:type "article", com a data de publicação. */
  artigo?: { publicado: string };
};

/** Título, descrição, canônico, Open Graph e cartão do X de uma página. O título absoluto ignora o sufixo do layout. */
export function metadados(seo: Seo, opcoes: OpcoesMetadados = {}): Metadata {
  const { caminho, artigo } = opcoes;
  const titulo = seo.compartilhamento ?? tituloFinal(seo, empresa.nome);
  const comum = {
    title: titulo,
    description: seo.descricao,
    locale: "pt_BR",
    siteName: empresa.nome,
    ...(caminho ? { url: caminho } : {}),
  };
  // Com imagem explícita, o Next deixa de usar o opengraph-image.tsx do artigo; por isso o artigo não leva a da Início.
  // Sem twitter:image, o X usa o og:image.
  const openGraph: Metadata["openGraph"] = artigo
    ? { ...comum, type: "article", publishedTime: artigo.publicado }
    : { ...comum, type: "website", images: [IMAGEM_PADRAO] };
  return {
    title: seo.absoluto ? { absolute: seo.titulo } : seo.titulo,
    description: seo.descricao,
    ...(caminho ? { alternates: { canonical: caminho } } : {}),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: seo.descricao,
      ...(artigo ? {} : { images: [IMAGEM_PADRAO] }),
    },
  };
}

/** O título como aparece na aba e no Google. */
export function tituloFinal(seo: Seo, marca: string): string {
  return seo.absoluto ? seo.titulo : `${seo.titulo} | ${marca}`;
}
