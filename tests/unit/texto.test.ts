import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function arquivos(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

const ARQUIVOS = arquivos("content").filter((f) => /\.(ts|tsx|mdx)$/.test(f));

// Palavras de estoque, por radical, para pegar plurais e flexões.
const ESTOQUE =
  /(^|[^\p{L}])(alavanc|robust|empodera|destrava|acionáve|orientad[oa] a dados|soluç|sinergi|escaláve|mergulh|elevar|testamento|panorama)/iu;

describe("portão de texto", () => {
  it("encontra arquivos de conteúdo", () => {
    expect(ARQUIVOS.length).toBeGreaterThan(0);
  });

  for (const arquivo of ARQUIVOS) {
    it(`${arquivo}: sem travessão e sem palavra de estoque`, () => {
      const visivel = readFileSync(arquivo, "utf8")
        .split("\n")
        .filter((linha) => !linha.trim().startsWith("//"))
        .join("\n");
      expect(visivel.includes("—"), "travessão (—) encontrado").toBe(false);
      expect(visivel.match(ESTOQUE)?.[0] ?? null).toBeNull();
    });
  }
});
