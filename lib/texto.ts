/** Troca cada {chave} do modelo pelo valor. Chave sem valor fica como está. */
export function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (trecho, chave: string) => valores[chave] ?? trecho);
}
