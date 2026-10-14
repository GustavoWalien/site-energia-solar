import { describe, expect, it } from "vitest";
import type { Config, TextosConceito } from "@/content/tipos";
import { linhaConceito } from "@/lib/conceito";

const textos: TextosConceito = {
  aviso: { selo: "s", titulo: "t", texto: "x", botaoAutor: "a", botaoFechar: "f", fecharRotulo: "r" },
  rodape: "Projeto conceito de Autor.",
};
const autor = { nome: "Autor", whatsapp: "5565981222210", mensagemWhatsapp: "m", email: "a@b.com", remetente: "Site <site@exemplo.com>", portfolio: "https://exemplo.com" };

describe("linhaConceito", () => {
  it("no modo conceito devolve o texto e o link do portfólio", () => {
    expect(linhaConceito({ modoConceito: true, autor } satisfies Config, textos)).toEqual({
      texto: "Projeto conceito de Autor.",
      href: "https://exemplo.com",
    });
  });

  it("para cliente real não existe", () => {
    expect(linhaConceito({ modoConceito: false, autor } satisfies Config, textos)).toBeNull();
  });
});
