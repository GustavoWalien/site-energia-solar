import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("scripts/og.mjs", () => {
  it("usa as cores do @theme da página, sem cor fixa, para a imagem seguir as cores de outro cliente", () => {
    expect(readFileSync("scripts/og.mjs", "utf8")).not.toMatch(/#[0-9a-f]{6}\b/i);
  });
});
