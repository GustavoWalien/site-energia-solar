import type { MDXContent } from "mdx/types";
import type { MetadadosArtigo } from "@/content/tipos";
import Creditos, { metadata as creditos } from "./creditos-de-energia-energisa.mdx";
import FioB, { metadata as fioB } from "./energia-solar-vale-a-pena-2026-fio-b.mdx";
import Seca, { metadata as seca } from "./placas-solares-geram-menos-na-seca.mdx";

export type Artigo = { slug: string; metadata: MetadadosArtigo; Conteudo: MDXContent };

/** Os artigos do blog, por slug (o endereço /blog/{slug}). */
export const artigos: Artigo[] = [
  { slug: "energia-solar-vale-a-pena-2026-fio-b", metadata: fioB, Conteudo: FioB },
  { slug: "placas-solares-geram-menos-na-seca", metadata: seca, Conteudo: Seca },
  { slug: "creditos-de-energia-energisa", metadata: creditos, Conteudo: Creditos },
];
