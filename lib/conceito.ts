import type { Config, TextosConceito } from "@/content/tipos";

/** Linha do rodapé que avisa que tudo é fictício. Fora do modo conceito, não existe. */
export function linhaConceito(config: Config, textos: TextosConceito): { texto: string; href: string } | null {
  if (!config.modoConceito) return null;
  return { texto: textos.rodape, href: config.autor.portfolio };
}
