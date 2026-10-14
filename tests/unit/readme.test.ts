import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync("README.md", "utf8");
const scripts = Object.keys(JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<string, string>);

describe("README.md", () => {
  it("fala do projeto, com o endereço no ar, e não é mais o texto padrão do create-next-app", () => {
    expect(readme).toContain("# Ipê Solar");
    expect(readme).toContain("https://ipe-solar.vercel.app");
    expect(readme).not.toContain("create-next-app");
  });

  it("não promete imagem de compartilhamento própria em toda página (só os artigos têm)", () => {
    expect(readme).not.toContain("imagem de compartilhamento por página");
    expect(readme).toContain("uma por artigo");
  });

  it("todo comando npm run citado existe no package.json", () => {
    const citados = [...readme.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
    expect(citados.length).toBeGreaterThan(3);
    for (const c of citados) expect(scripts, `npm run ${c}`).toContain(c);
  });

  it("todo caminho citado existe no projeto", () => {
    const citados = [...readme.matchAll(/`((?:app|components|content|lib|scripts|docs|tests)\/[^`\s]*|CONTEUDO\.md)`/g)].map(
      (m) => m[1],
    );
    expect(citados.length).toBeGreaterThan(5);
    for (const caminho of citados) expect(existsSync(caminho), `${caminho} não existe`).toBe(true);
  });

  it("avisa que, fora de produção, o SDK do Resend escreve o erro inteiro no terminal", () => {
    expect(readme).toMatch(/fora de produção/);
    expect(readme).toMatch(/SDK do Resend/);
  });

  it("avisa que o npm run dev com o .env.local envia e-mail de verdade", () => {
    expect(readme).toMatch(/\.env\.local/);
    expect(readme).toMatch(/e-mail de verdade/);
  });
});

describe("CONTEUDO.md", () => {
  const guia = readFileSync("CONTEUDO.md", "utf8");

  it("passo 1: integração do Resend e domínio do site no build e no servidor", () => {
    const passo1 = guia.slice(guia.indexOf("## 1."), guia.indexOf("## 2."));
    expect(passo1).toContain("RESEND_API_KEY");
    expect(passo1).toContain("NEXT_PUBLIC_SITE_URL");
    expect(passo1).toMatch(/build e (também )?no servidor/);
    expect(passo1).toContain("mesmo domínio verificado no Resend");
  });
});
