import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
const inicio = css.indexOf("@theme static {");
const tema = css.slice(inicio, css.indexOf("}", inicio));
const cor: Record<string, string> = Object.fromEntries(
  [...tema.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
);

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contraste(a: string, b: string): number {
  const [alto, baixo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alto! + 0.05) / (baixo! + 0.05);
}

describe("contraste das cores da marca", () => {
  it("lê os tokens do @theme", () => {
    expect(Object.keys(cor)).toEqual(
      expect.arrayContaining(["ipe", "ceu-claro", "ceu", "profundo", "mata", "papel", "tinta-suave", "rotulo", "erro"]),
    );
  });

  it.each([
    ["profundo", "papel", 4.5],
    ["tinta-suave", "papel", 4.5],
    ["rotulo", "papel", 4.5],
    ["erro", "papel", 4.5],
    ["profundo", "ceu-claro", 4.5],
    ["profundo", "ipe", 4.5],
    ["papel", "profundo", 4.5],
    ["ceu-claro", "profundo", 4.5],
    ["ipe", "profundo", 4.5],
  ])("%s sobre %s ≥ %s:1", (frente, fundo, minimo) => {
    expect(contraste(cor[frente]!, cor[fundo]!)).toBeGreaterThanOrEqual(minimo);
  });
});
