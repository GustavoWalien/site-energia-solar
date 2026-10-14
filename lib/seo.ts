import type { Metadata } from "next";
import type { Seo } from "@/content/tipos";

/** Título e descrição de uma página. O título absoluto ignora o sufixo " | {marca}" do layout. */
export function metadados(seo: Seo): Metadata {
  return { title: seo.absoluto ? { absolute: seo.titulo } : seo.titulo, description: seo.descricao };
}

/** O título como aparece na aba e no Google. */
export function tituloFinal(seo: Seo, marca: string): string {
  return seo.absoluto ? seo.titulo : `${seo.titulo} | ${marca}`;
}
