import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Largura e altura de um PNG, lidas do cabeçalho IHDR. */
function medidas(caminho: string) {
  const b = readFileSync(caminho);
  expect(b.subarray(1, 4).toString("latin1")).toBe("PNG");
  return { largura: b.readUInt32BE(16), altura: b.readUInt32BE(20) };
}

describe("imagens geradas por scripts/og.mjs", () => {
  it("a imagem de compartilhamento da Início tem 1200 × 630 e menos de 8 MB", () => {
    expect(medidas("app/opengraph-image.png")).toEqual({ largura: 1200, altura: 630 });
    expect(statSync("app/opengraph-image.png").size).toBeLessThan(8 * 1024 * 1024);
  });

  it("o ícone da Apple tem 180 × 180", () => {
    expect(medidas("app/apple-icon.png")).toEqual({ largura: 180, altura: 180 });
  });
});
