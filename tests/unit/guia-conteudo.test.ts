import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function arquivos(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

const COR_FIXA = /#(F5B800|0E3557)\b/i;

describe("CONTEUDO.md", () => {
  const guia = existsSync("CONTEUDO.md") ? readFileSync("CONTEUDO.md", "utf8") : "";

  it("existe e segue a ordem da spec (seção 16): cada passo na sua seção, e as seções em ordem", () => {
    const passos: [string, string[]][] = [
      ["## 1.", ["content/empresa.ts", "content/config.ts"]],
      ["## 2.", ["app/globals.css"]],
      ["## 3.", ["content/inicio.ts"]],
      ["## 4.", ["content/simulador.ts"]],
      ["## 5.", ["content/blog/"]],
      ["## 6.", ["components/hero/camadas/"]],
      ["## 7.", ["node scripts/og.mjs", "npm run test:all"]],
    ];
    const inicios = passos.map(([titulo]) => guia.indexOf(titulo));
    expect(inicios.every((p) => p >= 0)).toBe(true);
    expect([...inicios].sort((a, b) => a - b)).toEqual(inicios);
    passos.forEach(([titulo, citados], i) => {
      const secao = guia.slice(inicios[i], inicios[i + 1] ?? guia.length);
      for (const c of citados) expect(secao, `${c} falta na seção ${titulo}`).toContain(c);
    });
  });

  it("todo caminho citado existe no projeto", () => {
    const citados = [...guia.matchAll(/`((?:app|components|content|lib|scripts|docs|tests)\/[^`\s]*)`/g)].map((m) => m[1]);
    expect(citados.length).toBeGreaterThan(10);
    for (const caminho of citados) expect(existsSync(caminho), `${caminho} não existe`).toBe(true);
  });

  it("o passo do blog avisa que trocar um artigo muda os testes de rotas e de SEO e o Lighthouse", () => {
    const blog = guia.slice(guia.indexOf("## 5. Blog"), guia.indexOf("## 6."));
    for (const caminho of ["tests/e2e/seo.spec.ts", "tests/e2e/rotas.spec.ts", "scripts/lighthouse.mjs"]) {
      expect(blog, `o passo 5 não cita ${caminho}`).toContain(caminho);
    }
  });

  it("todo arquivo com as cores da marca fixas (fora o @theme) está listado no guia", () => {
    const comCorFixa = ["app", "components", "lib", "scripts"]
      .flatMap(arquivos)
      .filter((f) => /\.(tsx?|mjs|svg)$/.test(f) && COR_FIXA.test(readFileSync(f, "utf8")));
    expect(comCorFixa.length).toBeGreaterThan(0);
    for (const f of comCorFixa) expect(guia, `${f} tem cor fixa e não está no guia`).toContain(`\`${f}\``);
  });

  it("sem travessão", () => {
    expect(guia.includes("—")).toBe(false);
  });
});
