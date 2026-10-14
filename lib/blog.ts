import { artigos, type Artigo } from "@/content/blog";

const formato = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Do mais novo para o mais antigo, pela data AAAA-MM-DD do metadata. */
export function ordenarPorData<T extends { metadata: { data: string } }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => b.metadata.data.localeCompare(a.metadata.data));
}

/** "8 de outubro de 2026". Em UTC, para a data não mudar com o fuso de quem lê. */
export function dataPorExtenso(iso: string): string {
  return formato.format(new Date(`${iso}T00:00:00Z`));
}

/** Palavras do texto de um artigo MDX: sem o bloco do metadata, sem as tags dos componentes e sem a marcação. */
export function contarPalavras(fonte: string): number {
  const texto = fonte
    .replace(/^export const metadata = \{[\s\S]*?\n\};\n/m, "")
    .replace(/<[A-Z][^>]*\/>/g, " ")
    .replace(/<\/?[A-Z][^>]*>/g, " ")
    .replace(/^\|?\s*-{3}.*$/gm, " ")
    .replace(/[#*|>_`-]/g, " ");
  return texto.split(/\s+/).filter((palavra) => /[\p{L}\p{N}]/u.test(palavra)).length;
}

export const artigosOrdenados = ordenarPorData(artigos);

export function acharArtigo(slug: string): Artigo | undefined {
  return artigos.find((a) => a.slug === slug);
}
