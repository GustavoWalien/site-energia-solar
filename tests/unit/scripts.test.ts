import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dividirTitulo } from "../../scripts/titulo-og.mjs";

describe("scripts", () => {
  it("lighthouse.mjs apaga a pasta temporária num finally, mesmo se uma rodada falhar", () => {
    const fonte = readFileSync("scripts/lighthouse.mjs", "utf8");
    expect(fonte).toMatch(/finally\s*\{\s*rmSync\(pastaTemporaria/);
  });

  it("título da imagem: a última palavra vai para o marca-texto", () => {
    expect(dividirTitulo("Energia solar em Cuiabá")).toEqual({ inicio: "Energia solar em", destaque: "Cuiabá" });
  });

  it("título de uma palavra só: ela inteira vai para o marca-texto, sem pedaço perdido", () => {
    expect(dividirTitulo("Cuiabá")).toEqual({ inicio: "", destaque: "Cuiabá" });
    expect(dividirTitulo("  Cuiabá  ")).toEqual({ inicio: "", destaque: "Cuiabá" });
  });
});
