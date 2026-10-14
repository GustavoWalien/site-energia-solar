import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { acharArtigo } from "@/lib/blog";
import { entradasSitemap, regrasRobots, rotas } from "@/lib/rotas";

const CLIENTE = "https://cliente.com.br";

/** Os textos entre aspas do array `const NOME = [ ... ];` de um arquivo, em ordem alfabética. */
function listaDe(fonte: string, nome: string): string[] {
  const bloco = fonte.match(new RegExp(`const ${nome} = \\[([\\s\\S]*?)\\];`))?.[1] ?? "";
  return [...bloco.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort();
}

/** As chaves do objeto `const NOME: ... = { ... };` de um arquivo, em ordem alfabética. */
function chavesDe(fonte: string, nome: string): string[] {
  const bloco = fonte.match(new RegExp(`const ${nome}[^=]*= \\{([\\s\\S]*?)\\n\\};`))?.[1] ?? "";
  return [...bloco.matchAll(/^\s*"([^"]*)":/gm)].map((m) => m[1]).sort();
}

describe("rotas, sitemap e robots", () => {
  it("o sitemap tem as 12 páginas, sem a 404, no domínio recebido", () => {
    expect(entradasSitemap(CLIENTE).map((e) => e.url)).toEqual([
      "https://cliente.com.br",
      "https://cliente.com.br/servicos",
      "https://cliente.com.br/servicos/energia-solar-residencial",
      "https://cliente.com.br/servicos/energia-solar-para-empresas",
      "https://cliente.com.br/servicos/energia-solar-rural",
      "https://cliente.com.br/servicos/limpeza-de-placas-solares",
      "https://cliente.com.br/sobre",
      "https://cliente.com.br/contato",
      "https://cliente.com.br/blog",
      "https://cliente.com.br/blog/energia-solar-vale-a-pena-2026-fio-b",
      "https://cliente.com.br/blog/placas-solares-geram-menos-na-seca",
      "https://cliente.com.br/blog/creditos-de-energia-energisa",
    ]);
  });

  it("os artigos levam a própria data; as outras páginas, nenhuma", () => {
    const entradas = entradasSitemap(CLIENTE);
    const fioB = entradas.find((e) => e.url.endsWith("/blog/energia-solar-vale-a-pena-2026-fio-b"))!;
    expect(fioB.lastModified).toBe(acharArtigo("energia-solar-vale-a-pena-2026-fio-b")!.metadata.data);
    expect(entradas[0]).not.toHaveProperty("lastModified");
  });

  it("o robots libera tudo e aponta o sitemap do domínio recebido", () => {
    expect(regrasRobots(CLIENTE)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://cliente.com.br/sitemap.xml",
    });
  });

  it("as listas ROTAS dos testes de rotas e de SEO e a tabela TIPOS são as páginas do sitemap, nem mais nem menos", () => {
    const caminhos = rotas.map((r) => r.caminho).sort();
    for (const arquivo of ["tests/e2e/rotas.spec.ts", "tests/e2e/seo.spec.ts"]) {
      expect(listaDe(readFileSync(arquivo, "utf8"), "ROTAS"), `ROTAS de ${arquivo}`).toEqual(caminhos);
    }
    expect(chavesDe(readFileSync("tests/e2e/seo.spec.ts", "utf8"), "TIPOS"), "TIPOS de seo.spec.ts").toEqual(caminhos);
  });
});
