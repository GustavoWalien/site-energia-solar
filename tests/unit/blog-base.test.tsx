import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { contarPalavras, dataPorExtenso, ordenarPorData } from "@/lib/blog";
import { componentesMdx } from "@/mdx-components";
import Exemplo from "./fixtures/exemplo.mdx";

describe("base do blog", () => {
  it("o MDX renderiza com tabela (remark-gfm) e com os componentes do blog", () => {
    const html = renderToStaticMarkup(<Exemplo components={componentesMdx} />);
    expect(html).toContain("<h2>Um título de seção</h2>");
    expect(html).toMatch(/<td>2026<\/td>\s*<td>60%<\/td>/);
    expect(html).toContain("Na prática");
    expect(html).toContain('data-aviso=""');
  });

  it("ordena do mais novo para o mais antigo", () => {
    const lista = [{ metadata: { data: "2026-07-21" } }, { metadata: { data: "2026-10-08" } }, { metadata: { data: "2026-09-02" } }];
    expect(ordenarPorData(lista).map((a) => a.metadata.data)).toEqual(["2026-10-08", "2026-09-02", "2026-07-21"]);
  });

  it("data por extenso, sem depender do fuso de quem lê", () => {
    expect(dataPorExtenso("2026-10-08")).toBe("8 de outubro de 2026");
    expect(dataPorExtenso("2026-07-01")).toBe("1 de julho de 2026");
  });

  it("conta as palavras do texto, sem o metadata, sem as tags e sem a marcação", () => {
    const fonte = [
      "export const metadata = {",
      '  titulo: "não conta",',
      "};",
      "",
      "## Título aqui",
      "",
      "<NaPratica>",
      "Uma frase curta.",
      "</NaPratica>",
      "",
      "<Simulador />",
      "",
      "| Ano | % |",
      "| --- | --- |",
      "| 2026 | 60% |",
      "",
    ].join("\n");
    expect(contarPalavras(fonte)).toBe(8);
  });
});
