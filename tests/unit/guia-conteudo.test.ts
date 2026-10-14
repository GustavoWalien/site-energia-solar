import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CONTEUDO.md", () => {
  const guia = existsSync("CONTEUDO.md") ? readFileSync("CONTEUDO.md", "utf8") : "";

  it("existe e segue a ordem da spec (seção 16)", () => {
    const passos = [
      "content/empresa.ts",
      "content/config.ts",
      "app/globals.css",
      "content/inicio.ts",
      "content/simulador.ts",
      "content/blog/",
      "components/hero/camadas/",
      "node scripts/og.mjs",
      "npm run test:all",
    ];
    const posicoes = passos.map((p) => guia.indexOf(p));
    expect(posicoes.every((p) => p >= 0), `faltam: ${passos.filter((_, i) => posicoes[i] < 0).join(", ")}`).toBe(true);
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes);
  });

  it("todo caminho citado existe no projeto", () => {
    const citados = [...guia.matchAll(/`((?:app|components|content|lib|scripts|docs|tests)\/[^`\s]*)`/g)].map((m) => m[1]);
    expect(citados.length).toBeGreaterThan(10);
    for (const caminho of citados) expect(existsSync(caminho), `${caminho} não existe`).toBe(true);
  });

  it("sem travessão", () => {
    expect(guia.includes("—")).toBe(false);
  });
});
