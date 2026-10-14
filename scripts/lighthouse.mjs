// Roda o Lighthouse na Início, num serviço e num artigo, no celular e no computador (spec, seção 14).
// Relatórios em .lighthouse/, fora do Git. Sai com código 1 se Acessibilidade, Boas práticas ou SEO ficar
// abaixo de 95. O Desempenho local (WSL, sem GPU) só é anotado; a meta vale no endereço real.
// Uso, com o site rodando no próprio endereço (para o canônico apontar para ele):
//   NEXT_PUBLIC_SITE_URL=http://localhost:3300 npm run build && npx next start -p 3300
//   npm run lighthouse -- http://localhost:3300
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3300";
const PAGINAS = {
  inicio: "/",
  servico: "/servicos/energia-solar-residencial",
  artigo: "/blog/energia-solar-vale-a-pena-2026-fio-b",
};
const FORMATOS = { celular: [], computador: ["--preset=desktop"] };
const CATEGORIAS = {
  performance: "Desempenho",
  accessibility: "Acessibilidade",
  "best-practices": "Boas práticas",
  seo: "SEO",
};
const PORTAO = ["Acessibilidade", "Boas práticas", "SEO"];

mkdirSync(".lighthouse", { recursive: true });
// No WSL, o chrome-launcher cria o perfil temporário do Chrome com um caminho do Windows ("C:\Users\...\lighthouse.XXXX"),
// que o Linux trata como relativo à pasta atual. Rodando de uma pasta temporária, o perfil não cai dentro do projeto
// (onde o Tailwind tentaria ler o socket dele e quebraria o build).
const pastaTemporaria = mkdtempSync(join(tmpdir(), "lighthouse-ipe-"));
const linhas = [];
for (const [pagina, caminho] of Object.entries(PAGINAS)) {
  for (const [formato, extra] of Object.entries(FORMATOS)) {
    const saida = resolve(".lighthouse", `${pagina}-${formato}`);
    execFileSync(
      "npx",
      [
        "-y",
        "lighthouse@13.5.0",
        `${base}${caminho}`,
        "--quiet",
        "--output=json",
        "--output=html",
        `--output-path=${saida}`,
        "--chrome-flags=--headless=new --no-sandbox",
        ...extra,
      ],
      { cwd: pastaTemporaria, stdio: "inherit", env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
    );
    const relatorio = JSON.parse(readFileSync(`${saida}.report.json`, "utf8"));
    const notas = Object.fromEntries(
      Object.entries(CATEGORIAS).map(([id, nome]) => [nome, Math.round(relatorio.categories[id].score * 100)]),
    );
    linhas.push({ pagina, formato, ...notas });
  }
}
rmSync(pastaTemporaria, { recursive: true, force: true });
console.table(linhas);
const abaixo = linhas.filter((l) => PORTAO.some((nome) => l[nome] < 95));
if (abaixo.length) {
  console.error("Abaixo de 95:", abaixo.map((l) => `${l.pagina} no ${l.formato}`).join(", "));
  process.exitCode = 1;
}
