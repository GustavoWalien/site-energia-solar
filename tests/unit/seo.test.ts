import { describe, expect, it } from "vitest";
import { metadados, tituloFinal } from "@/lib/seo";

describe("seo", () => {
  it("título comum ganha o sufixo do modelo do layout", () => {
    const seo = { titulo: "Energia solar rural em Mato Grosso", descricao: "Texto." };
    expect(metadados(seo)).toEqual({ title: "Energia solar rural em Mato Grosso", description: "Texto." });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Energia solar rural em Mato Grosso | Ipê Solar");
  });

  it("título absoluto ignora o modelo, porque já traz a marca", () => {
    const seo = { titulo: "Contato | Ipê Solar Cuiabá", descricao: "Texto.", absoluto: true };
    expect(metadados(seo)).toEqual({ title: { absolute: "Contato | Ipê Solar Cuiabá" }, description: "Texto." });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Contato | Ipê Solar Cuiabá");
  });
});
