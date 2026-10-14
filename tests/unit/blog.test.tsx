import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { artigos } from "@/content/blog";
import { empresa } from "@/content/empresa";
import { acharArtigo, artigosOrdenados, contarPalavras } from "@/lib/blog";
import { tituloFinal } from "@/lib/seo";
import { componentesMdx } from "@/mdx-components";

const fonte = (slug: string) => readFileSync(`content/blog/${slug}.mdx`, "utf8");
const casos = artigos.map((a) => [a.slug, a] as const);

describe("artigos do blog", () => {
  it("os três artigos têm os endereços da spec, do mais novo para o mais antigo", () => {
    expect(artigosOrdenados.map((a) => a.slug)).toEqual([
      "energia-solar-vale-a-pena-2026-fio-b",
      "placas-solares-geram-menos-na-seca",
      "creditos-de-energia-energisa",
    ]);
    expect(acharArtigo("creditos-de-energia-energisa")?.metadata.capa).toBe("creditos");
    expect(acharArtigo("nao-existe")).toBeUndefined();
  });

  it.each(casos)("%s: metadados completos e SEO no tamanho", (_, a) => {
    const m = a.metadata;
    expect(tituloFinal({ titulo: m.tituloSeo, descricao: m.descricao }, empresa.nome).length).toBeLessThanOrEqual(60);
    expect(m.descricao.length).toBeGreaterThanOrEqual(50);
    expect(m.descricao.length).toBeLessThanOrEqual(160);
    expect(m.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(m.data))).toBe(false);
    expect(m.fontes.length).toBeGreaterThanOrEqual(2);
    for (const f of m.fontes) expect(f.url).toMatch(/^https:\/\//);
  });

  it.each(casos)("%s: de 700 a 900 palavras, e o tempo de leitura bate com 200 palavras por minuto", (slug, a) => {
    const palavras = contarPalavras(fonte(slug));
    expect(palavras).toBeGreaterThanOrEqual(700);
    expect(palavras).toBeLessThanOrEqual(900);
    expect(a.metadata.leitura).toBe(Math.round(palavras / 200));
  });

  it.each(casos)("%s: renderiza com os componentes, com seções em H2 e sem H1", (_, a) => {
    const html = renderToStaticMarkup(<a.Conteudo components={componentesMdx} />);
    expect(html).toContain("<h2>");
    expect(html).not.toContain("<h1");
    expect(html).toContain("Na prática");
    expect(html).toContain('class="chamada-orcamento"');
  });

  it("a tabela do Fio B segue a Lei 14.300: 45%, 60%, 75% e 90% de 2025 a 2028, e a regra da ANEEL em 2029", () => {
    const { Conteudo } = acharArtigo("energia-solar-vale-a-pena-2026-fio-b")!;
    const html = renderToStaticMarkup(<Conteudo components={componentesMdx} />);
    for (const [ano, parte] of [
      ["2025", "45%"],
      ["2026", "60%"],
      ["2027", "75%"],
      ["2028", "90%"],
      ["2029", "regra final definida pela ANEEL"],
    ]) {
      expect(html).toMatch(new RegExp(`<td>${ano}</td>\\s*<td>${parte}</td>`));
    }
    expect(html).toContain('class="simulador"');
  });

  it("o artigo do Fio B segue as datas da Lei 14.300 (art. 26, II e art. 27, § 2º)", () => {
    const texto = fonte("energia-solar-vale-a-pena-2026-fio-b");
    expect(texto).toContain("a partir de 8 de janeiro de 2023");
    expect(texto).toContain("até 7 de janeiro de 2023");
    expect(texto).toContain("entre janeiro e julho de 2023");
    expect(texto).toContain("só chega em 2031");
    expect(texto).not.toContain("Até 2022, essa ida e volta não pagava nada");
  });
});
