# Plano 5 (Google): plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar o progresso.

**Objetivo:** deixar o site pronto para o Google e para o link compartilhado, ainda no computador:
- a imagem de compartilhamento da Início e o ícone da Apple, gerados do hero de verdade;
- canônico, Open Graph e cartão do X em toda página;
- `sitemap.xml` e `robots.txt`;
- dados estruturados (JSON-LD) por página;
- o guia `CONTEUDO.md`, para trocar o site para outro cliente;
- uma rodada de Lighthouse local, com os relatórios fora do Git.

**Arquitetura:**
- **Metadados:**
  - `lib/seo.ts` ganha `metadados(seo, { caminho, artigo })`, que monta título, descrição, canônico, `openGraph` e `twitter` de uma vez;
  - cada página passa o próprio caminho;
  - a 404 não passa caminho e fica sem canônico.
- **Imagem padrão:**
  - `app/opengraph-image.png` é gerada por `scripts/og.mjs`, que abre o site com movimento reduzido (cena parada no meio-dia) e põe a placa e o título por cima;
  - **conferido num build:** com `openGraph` na página, o Next não herda a imagem de arquivo da raiz, então `metadados` põe a imagem padrão de forma explícita;
  - **também conferido:** a imagem explícita apaga a imagem de arquivo do artigo (`app/blog/[slug]/opengraph-image.tsx`). Por isso o artigo não leva a imagem padrão;
  - **na Início**, a explícita vence a de arquivo da raiz: sai um `og:image` só, com o `og:image:alt`. O canônico da raiz sai sem a barra final (`https://ipe-solar.vercel.app`).
- **Rotas:** `lib/rotas.ts` é a lista única das páginas do site. Ela alimenta o `app/sitemap.ts`, e o `app/robots.ts` aponta para o sitemap. As duas funções recebem o domínio, então o domínio de outro cliente entra sozinho.
- **Dados estruturados:** funções puras em `lib/jsonld.ts`, serializadas com `<` escapado (como manda `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`) e desenhadas pelo componente de servidor `DadosEstruturados`, um `<script type="application/ld+json">` por bloco.

**Stack:** Next.js 16.4, React 19.3, TypeScript, Vitest 5.0.3, Playwright 1.64.0 (também usado pelos scripts `og.mjs` e `lighthouse.mjs`), Lighthouse 13.5.0 por `npx`, sem instalar.

**Spec:** [docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md](../specs/2026-10-13-site-ipe-solar-design.md). Este plano cobre:
- o que faltava da seção 11 (SEO e compartilhamento);
- a seção 16 (`CONTEUDO.md`);
- da seção 14, os testes de SEO de cada rota e a rodada de Lighthouse.

O que depende das contas do usuário fica para o Plano 6: Vercel, Resend, Lighthouse no endereço real, a meta de quadros no aparelho de verdade (seção 13), README e portfólio.

## Roteiro dos planos

| Plano | O quê | Situação |
|---|---|---|
| 1. Fundação | Testes, cores, fontes, conteúdo, barra placa, rodapé, WhatsApp e aviso | feito, na `main` |
| 2. Início | Hero, seções, simulador, perguntas, formulário com transporte de e-mail | feito, na `main` |
| 3. Páginas | Serviços, Sobre, Contato e 404 | feito, na `main` |
| 4. Blog | MDX, 3 artigos completos, capas, imagens de compartilhamento por artigo | feito, na `main` |
| **5. Google (este)** | Imagem da Início, ícone da Apple, canônico e Open Graph, sitemap, robots, dados estruturados, `CONTEUDO.md`, Lighthouse local | |
| 6. No ar | Vercel, Resend (integração e envio real), Lighthouse e quadros no endereço real, README, portfólio | |

O antigo "5. Google e publicação" virou dois planos, seguindo a ordem aprovada na parte 4 do brainstorming ("Google" e depois "No ar"). O Plano 6 depende de passos do usuário (login na Vercel e aceite da integração do Resend). A spec, na seção 8, manda escrever o código do Resend pela skill que a integração instala, e não de memória. Esse código só pode ser planejado depois disso.

## Restrições globais

- **Dos Planos 1 a 4, valem todas:**
  - ler o guia em `node_modules/next/dist/docs/` antes de usar uma API do Next;
  - `ensureStatic = "navigation"`: o site inteiro sai pronto no build, então nada de `new Date()` em `sitemap.ts`, metadados ou páginas;
  - só português do Brasil;
  - o portão de texto (`tests/unit/texto.test.ts`) confere `content/`: nada de travessão nem palavra de estoque. Os textos novos de `content/` também entram em `docs/textos.md`, que é a fonte de todo texto do site;
  - um H1 por página;
  - `dynamicParams` não existe com `cacheComponents`;
  - para um slug desconhecido, o `generateMetadata` devolve os metadados da 404.
- **SEO (spec, seção 11):**
  - `metadataBase` vem de `SITE_URL` (`lib/site.ts`);
  - título com até 60 caracteres e descrição com até 160;
  - `openGraph` com `locale: "pt_BR"` e `twitter: summary_large_image` em cada página;
  - imagem de compartilhamento com 1200 × 630.
- **Dados estruturados (spec, seção 11):**

  | Página | Tipos |
  |---|---|
  | Início | `LocalBusiness` e `FAQPage` |
  | Serviço | `Service` (provedor: o negócio), `BreadcrumbList` e `FAQPage` |
  | Sobre e Contato | `LocalBusiness` e `BreadcrumbList` |
  | Artigo | `BlogPosting` e `BreadcrumbList` |

  No modo conceito, o `LocalBusiness` não leva telefone nem rua: só cidade, estado, país, áreas atendidas e horário.
- **Lighthouse (spec, seções 13 e 14):** Início, `/servicos/energia-solar-residencial` e um artigo, no celular e no computador. A meta é 95+ nas quatro notas. Os relatórios ficam em `.lighthouse/`, fora do Git.
- **Dependências:** nenhuma nova no `package.json`. Os scripts usam o `chromium` do `@playwright/test`. O Lighthouse roda por `npx -y lighthouse@13.5.0`, versão de 18/09/2026.
- **Git:** o trabalho acontece na branch `feat/google`, criada a partir da `main`. Cada tarefa termina em pelo menos um commit, e toda mensagem termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. O usuário autorizou o envio ao GitHub. O merge na `main` espera o ok dele.

## Foco da revisão

1. **Link de qualquer página compartilhado no WhatsApp:**
   - Sobre, um serviço ou a lista do blog mostram a imagem da Início;
   - um artigo mostra a própria imagem, e não a da Início. Num build de teste, a imagem padrão explícita apagou a do artigo.

   Teste na Tarefa 2, rota por rota.
2. **Endereço que não existe** (`/nao-existe` e `/servicos/nao-existe`): responde 404, sem canônico, sem `og:url` e sem dados estruturados, e não entra no sitemap. Testes nas Tarefas 2, 3 e 4.
3. **Modo conceito:** nenhum telefone nem endereço de rua nos dados estruturados, em nenhuma página. Desligado, o telefone aparece. Testes na Tarefa 4 (unidade e e2e).
4. **Texto com `<` ou aspas** numa pergunta ou num título: não fecha o `<script>` do JSON-LD nem quebra o JSON. Teste na Tarefa 4.
5. **Outro cliente, outro domínio:** com `NEXT_PUBLIC_SITE_URL=https://cliente.com.br`, o sitemap, o robots e os dados estruturados usam esse domínio. Uma página nova que entra no sitemap também precisa entrar no teste de rotas. Testes na Tarefa 3.

---

### Tarefa 1: Imagem da Início e ícone da Apple

**Arquivos:**
- Criar: `scripts/og.mjs`
- Criar (gerados pelo script e guardados no Git): `app/opengraph-image.png`, `app/apple-icon.png`
- Teste: `tests/unit/imagens.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consome: as classes do site `.topo__nome`, `.topo__flor` e `.hero__rotulo` (primeira faixa: "Energia solar em Cuiabá"), e o comportamento do hero com movimento reduzido (cena parada no meio-dia, uma tela de altura).
- Produz: `/opengraph-image.png` (1200 × 630) e `/apple-icon.png` (180 × 180), servidos na raiz. A Tarefa 2 aponta a imagem padrão para `/opengraph-image.png`.

- [ ] **Passo 1: Escrever o teste de unidade que falha**

Crie `tests/unit/imagens.test.ts`:

```ts
import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Largura e altura de um PNG, lidas do cabeçalho IHDR. */
function medidas(caminho: string) {
  const b = readFileSync(caminho);
  expect(b.subarray(1, 4).toString("latin1")).toBe("PNG");
  return { largura: b.readUInt32BE(16), altura: b.readUInt32BE(20) };
}

describe("imagens geradas por scripts/og.mjs", () => {
  it("a imagem de compartilhamento da Início tem 1200 × 630 e menos de 8 MB", () => {
    expect(medidas("app/opengraph-image.png")).toEqual({ largura: 1200, altura: 630 });
    expect(statSync("app/opengraph-image.png").size).toBeLessThan(8 * 1024 * 1024);
  });

  it("o ícone da Apple tem 180 × 180", () => {
    expect(medidas("app/apple-icon.png")).toEqual({ largura: 180, altura: 180 });
  });
});
```

- [ ] **Passo 2: Escrever o teste e2e que falha**

Crie `tests/e2e/seo.spec.ts` (a Tarefa 2 reescreve este arquivo):

```ts
import { expect, test } from "@playwright/test";

test("Início: imagem de compartilhamento da raiz e ícone da Apple", async ({ page, request }) => {
  await page.goto("/");
  const imagem = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(new URL(imagem!).pathname).toBe("/opengraph-image.png");
  const resposta = await request.get("/opengraph-image.png");
  expect(resposta.status()).toBe(200);
  expect(resposta.headers()["content-type"]).toBe("image/png");
  const icone = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(icone!)).status()).toBe(200);
});
```

- [ ] **Passo 3: Ver o vermelho**

Rode: `npx vitest run tests/unit/imagens.test.ts`
Esperado: FAIL com `ENOENT` em `app/opengraph-image.png`.

Rode: `npx playwright test tests/e2e/seo.spec.ts --project=desktop`
Esperado: FAIL, porque não existe `og:image` na Início e o teste estoura o tempo esperando o atributo.

- [ ] **Passo 4: Escrever o script**

Crie `scripts/og.mjs`:

```js
/* global document */
// Gera app/opengraph-image.png (1200 × 630) e app/apple-icon.png (180 × 180) a partir do site de verdade.
// A imagem da Início é a cena do meio-dia do hero (com movimento reduzido, o hero fica parado no meio-dia),
// com a placa e o título por cima. O nome, a flor e o título vêm da própria página, então outro cliente só
// precisa rodar o script de novo.
// Uso, com o site rodando:
//   npm run build && npx next start -p 3300
//   node scripts/og.mjs http://localhost:3300
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3300";

const ESTILO = `
  .topo, .hero__faixas, .hero__painel, .hero__dica, .flutuante, .pular { display: none !important; }
  .og { position: fixed; inset: 0; z-index: 50; pointer-events: none; font-family: var(--fonte-display); color: #0E3557; }
  .og__placa { position: absolute; left: 64px; top: 0; display: flex; align-items: center; gap: 12px;
    padding: 30px 26px 22px; background: #F5B800; border: 4px solid #0E3557; border-top: 0;
    border-radius: 0 0 24px 24px; box-shadow: 0 8px 0 #0E3557; font-weight: 800; font-size: 44px; letter-spacing: -0.01em; }
  .og__placa svg { width: 46px; height: 46px; }
  .og__titulo { position: absolute; left: 64px; top: 190px; max-width: 560px; margin: 0; font-weight: 800;
    font-size: 76px; line-height: 0.96; letter-spacing: -0.03em; }
  .og__titulo em { font-style: normal; background: linear-gradient(#F5B800, #F5B800) no-repeat 0 88% / 100% 0.28em; }
`;

const navegador = await chromium.launch();

// 1. imagem da Início
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
await pagina.goto(`${base}/`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
// as camadas da cena surgem num fade de 300 ms depois que o motor aplica o enquadramento
await pagina.waitForTimeout(1200);
await pagina.addStyleTag({ content: ESTILO });
const flor = await pagina.evaluate(() => {
  const nome = document.querySelector(".topo__nome").textContent.trim();
  const flor = document.querySelector(".topo__flor").outerHTML;
  const rotulo = document.querySelector(".hero__rotulo").textContent.trim();
  const corte = rotulo.lastIndexOf(" ");
  const og = document.createElement("div");
  og.className = "og";
  og.innerHTML =
    `<div class="og__placa">${flor}<span>${nome}</span></div>` +
    `<p class="og__titulo">${rotulo.slice(0, corte)} <em>${rotulo.slice(corte + 1)}</em>.</p>`;
  document.body.append(og);
  return flor;
});
await pagina.waitForTimeout(300);
await pagina.screenshot({ path: "app/opengraph-image.png" });

// 2. ícone da Apple: a flor da placa sobre o amarelo ipê (o iPhone arredonda os cantos sozinho)
const icone = await navegador.newPage({ viewport: { width: 180, height: 180 } });
await icone.setContent(
  `<style>body{margin:0;height:180px;display:grid;place-items:center;background:#F5B800;color:#0E3557}` +
    `svg{width:128px;height:128px}</style>${flor}`,
);
await icone.screenshot({ path: "app/apple-icon.png" });

await navegador.close();
console.log("app/opengraph-image.png e app/apple-icon.png gerados a partir de", base);
```

- [ ] **Passo 5: Gerar as imagens**

```bash
npm run build && (npx next start -p 3300 > /dev/null 2>&1 &) && sleep 4
node scripts/og.mjs http://localhost:3300
pkill -f "next start -p 3300"
```

Esperado: a mensagem "app/opengraph-image.png e app/apple-icon.png gerados a partir de http://localhost:3300".

- [ ] **Passo 6: Olhar as duas imagens**

Abra `app/opengraph-image.png` e `app/apple-icon.png` com a ferramenta de leitura de imagem. Compare com a composição aprovada na parte 3 do brainstorming (`.superpowers/brainstorm/68629-1791929773/content/og-inicio.png`):
- a placa amarela "Ipê Solar" com a flor, colada no topo à esquerda;
- "Energia solar em Cuiabá." em duas linhas, com o marca-texto amarelo em "Cuiabá";
- a cena do meio-dia: o sol, o ipê, a casa com as placas acesas e a Chapada;
- nenhum texto do hero, painel de hora, barra do topo ou botão flutuante.

Se o título cobrir a casa ou a placa sair cortada, ajuste só `left`, `top` e `font-size` no `ESTILO` e gere de novo.

- [ ] **Passo 7: Ver o verde**

Rode: `npx vitest run tests/unit/imagens.test.ts && npx playwright test tests/e2e/seo.spec.ts --project=desktop --project=mobile && npm run lint`
Esperado: PASS nos 2 testes de unidade e nos 2 e2e, e lint limpo.

- [ ] **Passo 8: Commit**

```bash
git add scripts/og.mjs app/opengraph-image.png app/apple-icon.png tests/unit/imagens.test.ts tests/e2e/seo.spec.ts
git commit -m "feat: imagem de compartilhamento da Início e ícone da Apple, gerados do hero

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: Canônico, Open Graph e cartão do X em toda página

**Arquivos:**
- Modificar: `content/tipos.ts` (tipos `Seo` e `Empresa`), `content/empresa.ts` (`seo`), `docs/textos.md` (seção 3, SEO)
- Modificar: `lib/seo.ts`
- Modificar: `app/page.tsx`, `app/servicos/page.tsx`, `app/servicos/[slug]/page.tsx`, `app/sobre/page.tsx`, `app/contato/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Teste: `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consome: `/opengraph-image.png` (Tarefa 1); `tituloFinal(seo, marca)` (já existe em `lib/seo.ts`).
- Produz:
  - `IMAGEM_PADRAO: { url: "/opengraph-image.png"; width: 1200; height: 630; alt: string }`;
  - `metadados(seo: Seo, opcoes?: { caminho?: string; artigo?: { publicado: string } }): Metadata`;
  - em `Seo`, o campo opcional `compartilhamento?: string`, que vira o `og:title`;
  - em `Empresa.seo`, o tipo `Seo & { imagemAlt: string }`.

- [ ] **Passo 1: Reescrever o teste de unidade**

Substitua `tests/unit/seo.test.ts` por:

```ts
import { describe, expect, it } from "vitest";
import { IMAGEM_PADRAO, metadados, tituloFinal } from "@/lib/seo";

describe("seo", () => {
  it("título comum ganha o sufixo do modelo do layout", () => {
    const seo = { titulo: "Energia solar rural em Mato Grosso", descricao: "Texto." };
    const m = metadados(seo);
    expect(m.title).toBe("Energia solar rural em Mato Grosso");
    expect(m.description).toBe("Texto.");
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Energia solar rural em Mato Grosso | Ipê Solar");
  });

  it("título absoluto ignora o modelo, porque já traz a marca", () => {
    const seo = { titulo: "Contato | Ipê Solar Cuiabá", descricao: "Texto.", absoluto: true };
    expect(metadados(seo).title).toEqual({ absolute: "Contato | Ipê Solar Cuiabá" });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Contato | Ipê Solar Cuiabá");
  });

  it("com o caminho, a página ganha canônico, og:url e a imagem da Início", () => {
    const m = metadados({ titulo: "Serviços de energia solar em Cuiabá", descricao: "Texto." }, { caminho: "/servicos" });
    expect(m.alternates).toEqual({ canonical: "/servicos" });
    expect(m.openGraph).toMatchObject({
      url: "/servicos",
      type: "website",
      locale: "pt_BR",
      siteName: "Ipê Solar",
      title: "Serviços de energia solar em Cuiabá | Ipê Solar",
      description: "Texto.",
      images: [IMAGEM_PADRAO],
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: [IMAGEM_PADRAO] });
  });

  it("sem caminho (a 404), não há canônico nem og:url", () => {
    const m = metadados({ titulo: "Página não encontrada", descricao: "Texto." });
    expect(m.alternates).toBeUndefined();
    expect(m.openGraph).not.toHaveProperty("url");
  });

  it("o artigo é article, com a data, e não leva a imagem da Início (a dele vem do opengraph-image.tsx)", () => {
    const m = metadados(
      { titulo: "Fio B em 2026", descricao: "Texto." },
      { caminho: "/blog/x", artigo: { publicado: "2026-10-08" } },
    );
    expect(m.openGraph).toMatchObject({ type: "article", publishedTime: "2026-10-08", url: "/blog/x" });
    expect(m.openGraph).not.toHaveProperty("images");
    expect(m.twitter).not.toHaveProperty("images");
  });

  it("o título de compartilhamento, quando existe, vira o og:title", () => {
    const m = metadados(
      { titulo: "Energia solar em Cuiabá", descricao: "Texto.", compartilhamento: "Ipê Solar · Energia solar em Cuiabá" },
      { caminho: "/" },
    );
    expect(m.openGraph?.title).toBe("Ipê Solar · Energia solar em Cuiabá");
    expect(m.twitter?.title).toBe("Ipê Solar · Energia solar em Cuiabá");
  });

  it("a imagem padrão tem 1200 × 630 e texto alternativo", () => {
    expect(IMAGEM_PADRAO).toMatchObject({ url: "/opengraph-image.png", width: 1200, height: 630 });
    expect(IMAGEM_PADRAO.alt.length).toBeGreaterThan(20);
  });
});
```

- [ ] **Passo 2: Reescrever o teste e2e**

Substitua `tests/e2e/seo.spec.ts` por:

```ts
import { expect, test } from "@playwright/test";

// O build dos testes não define NEXT_PUBLIC_SITE_URL, então o domínio é o padrão de lib/site.ts.
const SITE = "https://ipe-solar.vercel.app";

const ROTAS = [
  "/",
  "/servicos",
  "/servicos/energia-solar-residencial",
  "/servicos/energia-solar-para-empresas",
  "/servicos/energia-solar-rural",
  "/servicos/limpeza-de-placas-solares",
  "/sobre",
  "/contato",
  "/blog",
  "/blog/energia-solar-vale-a-pena-2026-fio-b",
  "/blog/placas-solares-geram-menos-na-seca",
  "/blog/creditos-de-energia-energisa",
];

const ehArtigo = (rota: string) => rota.startsWith("/blog/");
/** O endereço completo da rota. A raiz pode sair com ou sem a barra final. */
const endereco = (rota: string) => new RegExp(`^${SITE}${rota === "/" ? "/?" : rota}$`);

test.describe("SEO de cada página", () => {
  for (const rota of ROTAS) {
    test(`${rota}: canônico, Open Graph, cartão do X e imagem de compartilhamento`, async ({ page, request }) => {
      await page.goto(rota);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", endereco(rota));
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", endereco(rota));
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "pt_BR");
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        "content",
        ehArtigo(rota) ? "article" : "website",
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Ipê Solar/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /^.{50,160}$/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

      // o artigo mostra a própria imagem; as outras páginas, a da Início
      const imagens = await page.locator('meta[property="og:image"]').evaluateAll((els) =>
        els.map((el) => el.getAttribute("content")!),
      );
      expect(imagens).toHaveLength(1);
      const url = new URL(imagens[0]);
      expect(url.pathname).toBe(ehArtigo(rota) ? `${rota}/opengraph-image` : "/opengraph-image.png");
      const resposta = await request.get(url.pathname + url.search);
      expect(resposta.status()).toBe(200);
      expect(resposta.headers()["content-type"]).toBe("image/png");
    });
  }
});

test("Início: o link compartilhado diz \"Ipê Solar · Energia solar em Cuiabá\" e há ícone da Apple", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Ipê Solar · Energia solar em Cuiabá");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Ipê Solar/);
  const icone = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(icone!)).status()).toBe(200);
});

test("endereço que não existe: 404 sem canônico e sem og:url", async ({ page }) => {
  for (const rota of ["/nao-existe", "/servicos/nao-existe", "/blog/nao-existe"]) {
    const resposta = await page.goto(rota);
    expect(resposta!.status()).toBe(404);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  }
});
```

- [ ] **Passo 3: Ver o vermelho**

Rode: `npx vitest run tests/unit/seo.test.ts`
Esperado: FAIL, porque `IMAGEM_PADRAO` não existe e `metadados` não monta canônico nem `openGraph`.

Rode: `npx playwright test tests/e2e/seo.spec.ts --project=desktop`
Esperado: FAIL nos 12 testes de rota (não há `link[rel="canonical"]`) e no teste do título compartilhado. O teste da 404 pode passar, porque hoje nenhuma página tem canônico.

- [ ] **Passo 4: Tipos e conteúdo**

Em `content/tipos.ts`, troque a linha do tipo `Seo`:

```ts
/** Título e descrição de uma página. Com `absoluto`, o título ignora o sufixo " | Ipê Solar" do layout. */
export type Seo = { titulo: string; descricao: string; absoluto?: boolean };
```

por:

```ts
/** Título e descrição de uma página. Com `absoluto`, o título ignora o sufixo " | Ipê Solar" do layout. */
export type Seo = {
  titulo: string;
  descricao: string;
  absoluto?: boolean;
  /** Título do link compartilhado (og:title), quando ele é outro. Sem ele, vale o título da aba. */
  compartilhamento?: string;
};
```

No tipo `Empresa`, troque:

```ts
  /** Título e descrição padrão (página Início e páginas sem metadados próprios). */
  seo: { titulo: string; descricao: string };
```

por:

```ts
  /** Título e descrição da Início, o título do link compartilhado e o texto alternativo da imagem de compartilhamento. */
  seo: Seo & { imagemAlt: string };
```

Em `content/empresa.ts`, troque o bloco `seo` por:

```ts
  seo: {
    titulo: "Energia solar em Cuiabá",
    descricao:
      "Projeto, instalação e liberação na Energisa para casas, empresas e fazendas em Cuiabá e região. Simule sua economia e peça seu orçamento.",
    compartilhamento: "Ipê Solar · Energia solar em Cuiabá",
    imagemAlt: "Ipê Solar, energia solar em Cuiabá: casa com placas solares e um ipê-amarelo sob o sol do meio-dia.",
  },
```

Em `docs/textos.md`, seção 3, logo depois da linha `- Texto do link no WhatsApp: ...`, acrescente:

```md
- Texto alternativo da imagem de compartilhamento: `Ipê Solar, energia solar em Cuiabá: casa com placas solares e um ipê-amarelo sob o sol do meio-dia.`
```

- [ ] **Passo 5: `lib/seo.ts`**

Substitua `lib/seo.ts` por:

```ts
import type { Metadata } from "next";
import { empresa } from "@/content/empresa";
import type { Seo } from "@/content/tipos";

/** A imagem de compartilhamento da Início (app/opengraph-image.png, gerada por scripts/og.mjs). */
export const IMAGEM_PADRAO = { url: "/opengraph-image.png", width: 1200, height: 630, alt: empresa.seo.imagemAlt };

export type OpcoesMetadados = {
  /** Endereço da página, ex.: "/sobre". Vira o canônico e o og:url. Sem ele (a 404), a página fica sem canônico. */
  caminho?: string;
  /** Artigo do blog: og:type "article", com a data de publicação. */
  artigo?: { publicado: string };
};

/** Título, descrição, canônico, Open Graph e cartão do X de uma página. O título absoluto ignora o sufixo do layout. */
export function metadados(seo: Seo, opcoes: OpcoesMetadados = {}): Metadata {
  const { caminho, artigo } = opcoes;
  const titulo = seo.compartilhamento ?? tituloFinal(seo, empresa.nome);
  const comum = {
    title: titulo,
    description: seo.descricao,
    locale: "pt_BR",
    siteName: empresa.nome,
    ...(caminho ? { url: caminho } : {}),
  };
  // Com imagem explícita, o Next deixa de usar o opengraph-image.tsx do artigo; por isso o artigo não leva a da Início.
  // Sem twitter:image, o X usa o og:image.
  const openGraph: Metadata["openGraph"] = artigo
    ? { ...comum, type: "article", publishedTime: artigo.publicado }
    : { ...comum, type: "website", images: [IMAGEM_PADRAO] };
  return {
    title: seo.absoluto ? { absolute: seo.titulo } : seo.titulo,
    description: seo.descricao,
    ...(caminho ? { alternates: { canonical: caminho } } : {}),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: seo.descricao,
      ...(artigo ? {} : { images: [IMAGEM_PADRAO] }),
    },
  };
}

/** O título como aparece na aba e no Google. */
export function tituloFinal(seo: Seo, marca: string): string {
  return seo.absoluto ? seo.titulo : `${seo.titulo} | ${marca}`;
}
```

- [ ] **Passo 6: Cada página passa o próprio caminho**

`app/page.tsx`: acrescente os imports e a exportação, antes de `export default`:

```tsx
import { empresa } from "@/content/empresa";
import { metadados } from "@/lib/seo";

export const metadata = metadados(empresa.seo, { caminho: "/" });
```

`app/servicos/page.tsx`: troque `export const metadata = metadados(t.seo);` por:

```tsx
export const metadata = metadados(t.seo, { caminho: "/servicos" });
```

`app/sobre/page.tsx`: troque por `export const metadata = metadados(t.seo, { caminho: "/sobre" });`

`app/contato/page.tsx`: troque por `export const metadata = metadados(t.seo, { caminho: "/contato" });`

`app/blog/page.tsx`: troque por `export const metadata = metadados(t.seo, { caminho: "/blog" });`

`app/not-found.tsx` não muda: sem caminho, a 404 fica sem canônico.

`app/servicos/[slug]/page.tsx`: troque a última linha de `generateMetadata`:

```tsx
  return metadados(servico ? servico.seo : paginas.naoEncontrada.seo);
```

por:

```tsx
  if (!servico) return metadados(paginas.naoEncontrada.seo);
  return metadados(servico.seo, { caminho: `/servicos/${slug}` });
```

`app/blog/[slug]/page.tsx`: troque a última linha de `generateMetadata`:

```tsx
  return metadados({ titulo: artigo.metadata.tituloSeo, descricao: artigo.metadata.descricao });
```

por:

```tsx
  return metadados(
    { titulo: artigo.metadata.tituloSeo, descricao: artigo.metadata.descricao },
    { caminho: `/blog/${slug}`, artigo: { publicado: artigo.metadata.data } },
  );
```

O `app/layout.tsx` não muda. O `openGraph` e o `twitter` dele ficam como reserva, e cada página substitui os dois inteiros (o Next junta os metadados de forma rasa).

- [ ] **Passo 7: Ver o verde**

Rode: `npm test && npm run lint && npm run typecheck && npx playwright test tests/e2e/seo.spec.ts tests/e2e/blog.spec.ts tests/e2e/rotas.spec.ts`
Esperado: PASS em tudo. No `seo.spec.ts`, são 14 testes por projeto.

- [ ] **Passo 8: Commit**

```bash
git add content/tipos.ts content/empresa.ts docs/textos.md lib/seo.ts app tests/unit/seo.test.ts tests/e2e/seo.spec.ts
git commit -m "feat: canônico, Open Graph e cartão do X em toda página

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 3: Sitemap e robots

**Arquivos:**
- Criar: `lib/rotas.ts`, `app/sitemap.ts`, `app/robots.ts`
- Teste: `tests/unit/rotas.test.ts`, `tests/e2e/seo.spec.ts` (acrescentar)

**Interfaces:**
- Consome: `servicos` (`content/servicos.ts`), `artigosOrdenados` (`lib/blog.ts`), `SITE_URL` (`lib/site.ts`).
- Produz:
  - `type Rota = { caminho: string; data?: string }`;
  - `rotas: Rota[]`, as 12 páginas, na ordem: Início, serviços, Sobre, Contato e blog;
  - `entradasSitemap(siteUrl: string, lista?: Rota[]): MetadataRoute.Sitemap`;
  - `regrasRobots(siteUrl: string): MetadataRoute.Robots`.

- [ ] **Passo 1: Escrever o teste de unidade que falha**

Crie `tests/unit/rotas.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { acharArtigo } from "@/lib/blog";
import { entradasSitemap, regrasRobots, rotas } from "@/lib/rotas";

const CLIENTE = "https://cliente.com.br";

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

  it("toda página do sitemap também passa pelo teste de rotas e pelo teste de SEO", () => {
    for (const arquivo of ["tests/e2e/rotas.spec.ts", "tests/e2e/seo.spec.ts"]) {
      const texto = readFileSync(arquivo, "utf8");
      for (const { caminho } of rotas) expect(texto, `${caminho} falta em ${arquivo}`).toContain(`"${caminho}"`);
    }
  });
});
```

- [ ] **Passo 2: Escrever o teste e2e**

No fim de `tests/e2e/seo.spec.ts`, acrescente:

```ts
test("sitemap.xml com as 12 páginas e robots.txt apontando para ele", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const enderecos = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(enderecos).toHaveLength(12);
  expect(enderecos).toContain(`${SITE}/blog/energia-solar-vale-a-pena-2026-fio-b`);
  expect(enderecos.some((e) => e.includes("nao-existe"))).toBe(false);
  expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const texto = await robots.text();
  expect(texto).toMatch(/user-agent: \*/i);
  expect(texto).toMatch(/allow: \//i);
  expect(texto).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});
```

- [ ] **Passo 3: Ver o vermelho**

Rode: `npx vitest run tests/unit/rotas.test.ts`
Esperado: FAIL com "Cannot find package '@/lib/rotas'" ou erro equivalente de import.

- [ ] **Passo 4: `lib/rotas.ts`**

Antes de escrever, leia `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` e `robots.md`.

Crie `lib/rotas.ts`:

```ts
import type { MetadataRoute } from "next";
import { servicos } from "@/content/servicos";
import { artigosOrdenados } from "@/lib/blog";

/** Uma página do site. `data` (AAAA-MM-DD) só nos artigos. */
export type Rota = { caminho: string; data?: string };

/** Todas as páginas do site: a fonte do sitemap. Página nova entra aqui e nos testes de rotas e de SEO. */
export const rotas: Rota[] = [
  { caminho: "/" },
  { caminho: "/servicos" },
  ...servicos.map((s) => ({ caminho: `/servicos/${s.slug}` })),
  { caminho: "/sobre" },
  { caminho: "/contato" },
  { caminho: "/blog" },
  ...artigosOrdenados.map((a) => ({ caminho: `/blog/${a.slug}`, data: a.metadata.data })),
];

/** As entradas do sitemap no domínio recebido. Sem data de hoje: o site sai pronto no build. */
export function entradasSitemap(siteUrl: string, lista: Rota[] = rotas): MetadataRoute.Sitemap {
  return lista.map(({ caminho, data }) => ({
    url: caminho === "/" ? siteUrl : `${siteUrl}${caminho}`,
    ...(data ? { lastModified: data } : {}),
  }));
}

/** O robots.txt: libera tudo e aponta o sitemap. */
export function regrasRobots(siteUrl: string): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
```

- [ ] **Passo 5: `app/sitemap.ts` e `app/robots.ts`**

Crie `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { entradasSitemap } from "@/lib/rotas";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return entradasSitemap(SITE_URL);
}
```

Crie `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { regrasRobots } from "@/lib/rotas";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return regrasRobots(SITE_URL);
}
```

- [ ] **Passo 6: Ver o verde e conferir o build**

Rode: `npx vitest run tests/unit/rotas.test.ts && npm run lint && npm run typecheck`
Esperado: PASS nos 4 testes.

Rode: `npm run build 2>&1 | grep -E "sitemap|robots"`
Esperado: `/sitemap.xml` e `/robots.txt` aparecem como estáticos (`○`). Se o build reclamar de dado de visita no sitemap, confira se nenhum `new Date()` entrou.

Rode: `npx playwright test tests/e2e/seo.spec.ts`
Esperado: PASS, com o teste novo do sitemap nos dois projetos.

- [ ] **Passo 7: Commit**

```bash
git add lib/rotas.ts app/sitemap.ts app/robots.ts tests/unit/rotas.test.ts tests/e2e/seo.spec.ts
git commit -m "feat: sitemap e robots a partir da lista única de rotas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 4: Dados estruturados (JSON-LD)

**Arquivos:**
- Criar: `lib/jsonld.ts`, `components/seo/DadosEstruturados.tsx`
- Modificar: `app/page.tsx`, `app/servicos/[slug]/page.tsx`, `app/sobre/page.tsx`, `app/contato/page.tsx`, `app/blog/[slug]/page.tsx`
- Teste: `tests/unit/jsonld.test.ts`, `tests/e2e/seo.spec.ts` (acrescentar)

**Interfaces:**
- Consome: `Config`, `Empresa`, `Pergunta` e `Servico` (`content/tipos.ts`); `Artigo` (`content/blog/index.ts`); `SITE_URL`; `menu` (`content/navegacao.ts`); `paginas` (`content/paginas.ts`); `perguntas` (`content/perguntas.ts`).
- Produz:
  - `type Dados = Record<string, unknown>`;
  - `negocioLocal(config: Config, empresa: Empresa, siteUrl: string): Dados`;
  - `perguntasFrequentes(perguntas: Pergunta[]): Dados`;
  - `type ItemTrilha = { nome: string; caminho: string }`;
  - `trilha(itens: ItemTrilha[], siteUrl: string): Dados`;
  - `servicoOferecido(servico: Servico, empresa: Empresa, siteUrl: string): Dados`;
  - `artigoDoBlog(artigo: Artigo, empresa: Empresa, siteUrl: string): Dados`;
  - `serializar(dados: Dados): string`;
  - o componente `<DadosEstruturados dados={Dados[]} />`.

- [ ] **Passo 1: Escrever o teste de unidade que falha**

Crie `tests/unit/jsonld.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { acharArtigo } from "@/lib/blog";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { perguntas } from "@/content/perguntas";
import { servicos } from "@/content/servicos";
import {
  artigoDoBlog,
  negocioLocal,
  perguntasFrequentes,
  serializar,
  servicoOferecido,
  trilha,
} from "@/lib/jsonld";

const SITE = "https://ipe-solar.vercel.app";

describe("dados estruturados", () => {
  it("modo conceito: o negócio não tem telefone nem rua, só cidade, estado, país, áreas e horário", () => {
    const negocio = negocioLocal(config, empresa, SITE);
    const texto = JSON.stringify(negocio);
    expect(texto).not.toContain("telephone");
    expect(texto).not.toContain("streetAddress");
    expect(negocio).toMatchObject({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE}/#negocio`,
      name: "Ipê Solar",
      url: SITE,
      image: `${SITE}/opengraph-image.png`,
      address: { "@type": "PostalAddress", addressLocality: "Cuiabá", addressRegion: "MT", addressCountry: "BR" },
      openingHours: ["Mo-Fr 07:00-17:00", "Sa 07:00-11:00"],
    });
    expect(negocio.areaServed).toHaveLength(empresa.cidades.length);
  });

  it("modo desligado: o negócio leva o telefone, ou o WhatsApp quando não há fixo", () => {
    const real = { ...config, modoConceito: false };
    expect(negocioLocal(real, { ...empresa, telefone: "(65) 3333-4444" }, SITE).telephone).toBe("(65) 3333-4444");
    expect(negocioLocal(real, { ...empresa, telefone: "", whatsapp: "55 65 99999-8888" }, SITE).telephone).toBe(
      "55 65 99999-8888",
    );
  });

  it("perguntas frequentes: uma Question com Answer para cada pergunta", () => {
    const faq = perguntasFrequentes(perguntas);
    expect(faq["@type"]).toBe("FAQPage");
    const itens = faq.mainEntity as { "@type": string; name: string; acceptedAnswer: { text: string } }[];
    expect(itens).toHaveLength(perguntas.length);
    expect(itens[0]).toMatchObject({
      "@type": "Question",
      name: perguntas[0].pergunta,
      acceptedAnswer: { "@type": "Answer", text: perguntas[0].resposta },
    });
  });

  it("trilha: posições a partir de 1 e endereços completos, com a raiz sem barra", () => {
    const t = trilha(
      [
        { nome: "Início", caminho: "/" },
        { nome: "Blog", caminho: "/blog" },
      ],
      SITE,
    );
    expect(t).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      ],
    });
  });

  it("serviço: o provedor é o negócio, pelo mesmo @id", () => {
    const s = servicoOferecido(servicos[0], empresa, SITE);
    expect(s).toMatchObject({
      "@type": "Service",
      name: servicos[0].nome,
      url: `${SITE}/servicos/${servicos[0].slug}`,
      provider: { "@type": "LocalBusiness", "@id": `${SITE}/#negocio`, name: "Ipê Solar" },
    });
  });

  it("artigo: título, data, imagem própria e a empresa como autora", () => {
    const artigo = acharArtigo("energia-solar-vale-a-pena-2026-fio-b")!;
    const url = `${SITE}/blog/${artigo.slug}`;
    expect(artigoDoBlog(artigo, empresa, SITE)).toMatchObject({
      "@type": "BlogPosting",
      headline: artigo.metadata.titulo,
      datePublished: artigo.metadata.data,
      inLanguage: "pt-BR",
      url,
      image: `${url}/opengraph-image`,
      author: { "@type": "Organization", name: "Ipê Solar" },
    });
  });

  it("serializar escapa o < para o texto não fechar o <script>, e o JSON continua igual", () => {
    const dados = { name: '</script><script>alert("oi")</script>' };
    const texto = serializar(dados);
    expect(texto).not.toContain("<");
    expect(JSON.parse(texto)).toEqual(dados);
  });
});
```

- [ ] **Passo 2: Escrever o teste e2e**

No fim de `tests/e2e/seo.spec.ts`, acrescente:

```ts
const TIPOS: Record<string, string[]> = {
  "/": ["LocalBusiness", "FAQPage"],
  "/servicos": [],
  "/servicos/energia-solar-residencial": ["Service", "BreadcrumbList", "FAQPage"],
  "/servicos/energia-solar-para-empresas": ["Service", "BreadcrumbList", "FAQPage"],
  "/servicos/energia-solar-rural": ["Service", "BreadcrumbList", "FAQPage"],
  "/servicos/limpeza-de-placas-solares": ["Service", "BreadcrumbList", "FAQPage"],
  "/sobre": ["LocalBusiness", "BreadcrumbList"],
  "/contato": ["LocalBusiness", "BreadcrumbList"],
  "/blog": [],
  "/blog/energia-solar-vale-a-pena-2026-fio-b": ["BlogPosting", "BreadcrumbList"],
  "/blog/placas-solares-geram-menos-na-seca": ["BlogPosting", "BreadcrumbList"],
  "/blog/creditos-de-energia-energisa": ["BlogPosting", "BreadcrumbList"],
};

test.describe("dados estruturados de cada página", () => {
  for (const rota of ROTAS) {
    test(`${rota}: JSON válido, os tipos da spec e nenhum telefone no modo conceito`, async ({ page }) => {
      await page.goto(rota);
      const blocos = await page.locator('script[type="application/ld+json"]').allTextContents();
      const dados = blocos.map((b) => JSON.parse(b) as Record<string, unknown>);
      expect(dados.map((d) => d["@type"])).toEqual(TIPOS[rota]);
      for (const d of dados) expect(d["@context"]).toBe("https://schema.org");
      expect(blocos.join("")).not.toContain("telephone");
      expect(blocos.join("")).not.toContain("streetAddress");
    });
  }

  test("a 404 não tem dados estruturados", async ({ page }) => {
    await page.goto("/servicos/nao-existe");
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  });
});
```

- [ ] **Passo 3: Ver o vermelho**

Rode: `npx vitest run tests/unit/jsonld.test.ts`
Esperado: FAIL com erro de import de `@/lib/jsonld`.

- [ ] **Passo 4: `lib/jsonld.ts`**

Antes de escrever, leia `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.

Crie `lib/jsonld.ts`:

```ts
import type { Artigo } from "@/content/blog";
import type { Config, Empresa, Pergunta, Servico } from "@/content/tipos";

/** Um bloco de dados estruturados (schema.org). */
export type Dados = Record<string, unknown>;

const CONTEXTO = "https://schema.org";

const endereco = (siteUrl: string, caminho: string) => (caminho === "/" ? siteUrl : `${siteUrl}${caminho}`);

const cidades = (empresa: Empresa) => empresa.cidades.map((nome) => ({ "@type": "City", name: nome }));

/** O negócio. No modo conceito, sem telefone e sem rua: só cidade, estado, país, áreas atendidas e horário. */
export function negocioLocal(config: Config, empresa: Empresa, siteUrl: string): Dados {
  const telefone = config.modoConceito ? "" : empresa.telefone || empresa.whatsapp;
  return {
    "@context": CONTEXTO,
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#negocio`,
    name: empresa.nome,
    description: empresa.seo.descricao,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.png`,
    logo: `${siteUrl}/apple-icon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: empresa.cidade,
      addressRegion: empresa.estado,
      addressCountry: "BR",
    },
    areaServed: cidades(empresa),
    openingHours: empresa.horarioSchema,
    ...(telefone ? { telephone: telefone } : {}),
  };
}

/** As perguntas frequentes de uma página. */
export function perguntasFrequentes(perguntas: Pergunta[]): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "FAQPage",
    mainEntity: perguntas.map((p) => ({
      "@type": "Question",
      name: p.pergunta,
      acceptedAnswer: { "@type": "Answer", text: p.resposta },
    })),
  };
}

export type ItemTrilha = { nome: string; caminho: string };

/** A trilha de navegação, da Início até a página. */
export function trilha(itens: ItemTrilha[], siteUrl: string): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: endereco(siteUrl, item.caminho),
    })),
  };
}

/** Um serviço, com o negócio como provedor (o mesmo @id do LocalBusiness). */
export function servicoOferecido(servico: Servico, empresa: Empresa, siteUrl: string): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "Service",
    name: servico.nome,
    description: servico.seo.descricao,
    url: endereco(siteUrl, `/servicos/${servico.slug}`),
    provider: { "@type": "LocalBusiness", "@id": `${siteUrl}/#negocio`, name: empresa.nome, url: siteUrl },
    areaServed: cidades(empresa),
  };
}

/** Um artigo do blog, com a imagem própria e a empresa como autora e editora. */
export function artigoDoBlog(artigo: Artigo, empresa: Empresa, siteUrl: string): Dados {
  const url = endereco(siteUrl, `/blog/${artigo.slug}`);
  const organizacao = { "@type": "Organization", name: empresa.nome, url: siteUrl, logo: `${siteUrl}/apple-icon.png` };
  return {
    "@context": CONTEXTO,
    "@type": "BlogPosting",
    headline: artigo.metadata.titulo,
    description: artigo.metadata.descricao,
    datePublished: artigo.metadata.data,
    inLanguage: "pt-BR",
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: organizacao,
    publisher: organizacao,
  };
}

/** O JSON do <script>, com o < escapado para nenhum texto fechar a tag (guia json-ld.md do Next). */
export function serializar(dados: Dados): string {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
```

- [ ] **Passo 5: O componente**

Crie `components/seo/DadosEstruturados.tsx`:

```tsx
import { serializar, type Dados } from "@/lib/jsonld";

/** Os dados estruturados da página (schema.org), um <script> por bloco. Não aparecem na tela. */
export function DadosEstruturados({ dados }: { dados: Dados[] }) {
  return dados.map((d) => (
    <script key={String(d["@type"])} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializar(d) }} />
  ));
}
```

- [ ] **Passo 6: Cada página com os seus blocos**

`app/page.tsx` (Início): acrescente os imports

```tsx
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { config } from "@/content/config";
import { perguntas } from "@/content/perguntas";
import { negocioLocal, perguntasFrequentes } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
```

e ponha como primeiro filho do fragmento, antes de `<Hero />`:

```tsx
      <DadosEstruturados dados={[negocioLocal(config, empresa, SITE_URL), perguntasFrequentes(perguntas)]} />
```

`app/servicos/[slug]/page.tsx`: acrescente os imports

```tsx
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { empresa } from "@/content/empresa";
import { perguntasFrequentes, servicoOferecido, trilha } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
```

e troque `return <PaginaServico servico={servico} />;` por:

```tsx
  const t = paginas.servico;
  return (
    <>
      <DadosEstruturados
        dados={[
          servicoOferecido(servico, empresa, SITE_URL),
          trilha(
            [
              { nome: t.trilhaInicio, caminho: "/" },
              { nome: t.trilhaServicos, caminho: "/servicos" },
              { nome: servico.nome, caminho: `/servicos/${servico.slug}` },
            ],
            SITE_URL,
          ),
          perguntasFrequentes(servico.perguntas),
        ]}
      />
      <PaginaServico servico={servico} />
    </>
  );
```

`app/sobre/page.tsx`: acrescente os imports

```tsx
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { config } from "@/content/config";
import { menu } from "@/content/navegacao";
import { negocioLocal, trilha } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
```

e ponha como primeiro filho do fragmento, antes de `<CabecalhoPagina`:

```tsx
      <DadosEstruturados
        dados={[
          negocioLocal(config, empresa, SITE_URL),
          trilha(
            [
              { nome: paginas.servico.trilhaInicio, caminho: "/" },
              { nome: menu.find((l) => l.href === "/sobre")!.rotulo, caminho: "/sobre" },
            ],
            SITE_URL,
          ),
        ]}
      />
```

`app/contato/page.tsx`: acrescente os imports

```tsx
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { negocioLocal, trilha } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
```

e ponha como primeiro filho do fragmento, antes de `<CabecalhoPagina`:

```tsx
      <DadosEstruturados
        dados={[
          negocioLocal(config, empresa, SITE_URL),
          trilha(
            [
              { nome: paginas.servico.trilhaInicio, caminho: "/" },
              { nome: menu.find((l) => l.href === "/contato")!.rotulo, caminho: "/contato" },
            ],
            SITE_URL,
          ),
        ]}
      />
```

`app/blog/[slug]/page.tsx`: acrescente os imports

```tsx
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { empresa } from "@/content/empresa";
import { artigoDoBlog, trilha } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
```

e ponha como primeiro filho do fragmento de `PaginaArtigo`, antes de `<CabecalhoPagina`:

```tsx
      <DadosEstruturados
        dados={[
          artigoDoBlog(artigo, empresa, SITE_URL),
          trilha(
            [
              { nome: t.trilhaInicio, caminho: "/" },
              { nome: t.trilhaBlog, caminho: "/blog" },
              { nome: m.titulo, caminho: `/blog/${slug}` },
            ],
            SITE_URL,
          ),
        ]}
      />
```

- [ ] **Passo 7: Ver o verde**

Rode: `npm test && npm run lint && npm run typecheck && npx playwright test tests/e2e/seo.spec.ts tests/e2e/rotas.spec.ts`
Esperado: PASS em tudo. Os 12 testes novos de dados estruturados e o da 404 rodam nos dois projetos.

- [ ] **Passo 8: Conferir num validador**

Rode `npm run build && (npx next start -p 3300 > /dev/null 2>&1 &)` e salve o HTML da Início e de um artigo:

```bash
curl -s http://localhost:3300/ > /tmp/inicio.html
curl -s http://localhost:3300/blog/energia-solar-vale-a-pena-2026-fio-b > /tmp/artigo.html
pkill -f "next start -p 3300"
```

Cole o `<script type="application/ld+json">` de cada um no [Schema Markup Validator](https://validator.schema.org/) (aba "Code snippet", sem publicar nada). Esperado: zero erros. Avisos de campo recomendado são aceitos e anotados no registro. Se não houver navegador disponível, registre que o passo ficou para o Plano 6, com o site no ar.

- [ ] **Passo 9: Commit**

```bash
git add lib/jsonld.ts components/seo app tests/unit/jsonld.test.ts tests/e2e/seo.spec.ts
git commit -m "feat: dados estruturados (JSON-LD) por página, sem telefone no modo conceito

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: Guia `CONTEUDO.md` para trocar de cliente

**Arquivos:**
- Criar: `CONTEUDO.md`
- Teste: `tests/unit/guia-conteudo.test.ts`

**Interfaces:**
- Consome: os caminhos reais do projeto, que o teste confere um por um.
- Produz: o guia da spec, seção 16.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/unit/guia-conteudo.test.ts`:

```ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CONTEUDO.md", () => {
  const guia = existsSync("CONTEUDO.md") ? readFileSync("CONTEUDO.md", "utf8") : "";

  it("existe e segue a ordem da spec (seção 16)", () => {
    const passos = [
      "content/empresa.ts",
      "content/config.ts",
      "app/globals.css",
      "content/inicio.ts",
      "content/simulador.ts",
      "content/blog/",
      "components/hero/camadas/",
      "node scripts/og.mjs",
      "npm run test:all",
    ];
    const posicoes = passos.map((p) => guia.indexOf(p));
    expect(posicoes.every((p) => p >= 0), `faltam: ${passos.filter((_, i) => posicoes[i] < 0).join(", ")}`).toBe(true);
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes);
  });

  it("todo caminho citado existe no projeto", () => {
    const citados = [...guia.matchAll(/`((?:app|components|content|lib|scripts|docs|tests)\/[^`\s]*)`/g)].map((m) => m[1]);
    expect(citados.length).toBeGreaterThan(10);
    for (const caminho of citados) expect(existsSync(caminho), `${caminho} não existe`).toBe(true);
  });

  it("sem travessão", () => {
    expect(guia.includes("—")).toBe(false);
  });
});
```

- [ ] **Passo 2: Ver o vermelho**

Rode: `npx vitest run tests/unit/guia-conteudo.test.ts`
Esperado: FAIL no primeiro e no segundo teste, porque o guia não existe.

- [ ] **Passo 3: Escrever o guia**

Crie `CONTEUDO.md`:

````md
# Como trocar o site para outro cliente

Este site é um modelo. A Ipê Solar é uma empresa fictícia, e quase tudo o que muda de um cliente para outro fica em `content/`. Siga os passos nesta ordem. No fim, rode os testes.

## 1. Dados da empresa e modo conceito

Em `content/empresa.ts`:
- nome, frase, cidade, estado e cidades atendidas;
- WhatsApp com DDI 55 e DDD (ex.: `"55 65 99999-8888"`), telefone fixo (vazio, o bloco some), horário em texto e no formato do Google (`horarioSchema`);
- números da empresa, ano e bairro de fundação, e a consulta do mapa;
- `emailPedidos` (quem recebe os pedidos do formulário) e `remetente` (um endereço de domínio verificado no Resend);
- `seo`: título e descrição da Início, o título do link compartilhado e o texto alternativo da imagem.

Em `content/config.ts`, troque `modoConceito` para `false`. Com o modo desligado:
- os botões de WhatsApp vão direto para o número da empresa, sem o aviso de projeto conceito;
- o formulário manda o pedido para `emailPedidos`;
- os dados do Google ganham o telefone;
- somem a linha "Projeto conceito" do rodapé e a nota dos depoimentos.

## 2. Cores

As cores ficam no `@theme` de `app/globals.css`: `ipe`, `ceu-claro`, `ceu`, `profundo`, `mata` e `papel`. Depois de trocar, rode `npx vitest run tests/unit/contraste.test.ts`: ele confere se os pares de texto e fundo continuam legíveis (4,5:1).

## 3. Textos

Reescreva `content/inicio.ts`, `content/servicos.ts`, `content/equipe.ts`, `content/depoimentos.ts`, `content/perguntas.ts` e `content/paginas.ts`. Guarde a versão de referência de cada texto em `docs/textos.md`.

Regras, conferidas pelo teste `tests/unit/texto.test.ts`:
- nada de travessão;
- nada de palavras de estoque (alavancar, robusto, empoderar, destravar, solução e parecidas);
- título da aba com até 60 caracteres, já contando " | Nome da empresa", e descrição de 50 a 160.

Cada serviço em `content/servicos.ts` vira uma página em `/servicos/{slug}`. Para acrescentar ou tirar um serviço, mexa só nessa lista e atualize as rotas nos testes `tests/e2e/rotas.spec.ts` e `tests/e2e/seo.spec.ts`.

## 4. Simulador

Em `content/simulador.ts`, ajuste a tarifa (R$ por kWh com impostos), a taxa mínima, a geração por kWp na região do cliente, a potência da placa e a perda do Fio B do ano. Cada constante tem a fonte em comentário. Os casos de teste de `tests/unit/simulador.test.ts` mudam junto.

## 5. Blog

Os artigos ficam em `content/blog/`, um `.mdx` por artigo, e entram no índice `content/blog/index.ts`. Cada um exporta `metadata` com título, título curto para a aba (`tituloSeo`), descrição, data, minutos de leitura, capa e fontes. Para tirar um artigo, apague o arquivo e a linha dele no índice. As capas ilustradas ficam em `components/blog/Capa.tsx`.

## 6. Hero

O hero é um desenho em SVG, em camadas, guiado pela rolagem. Os elementos de Cuiabá ficam isolados em `components/hero/camadas/`, para trocar sem mexer no motor (`components/hero/MotorDoHero.tsx`):
- a Chapada dos Guimarães com a cachoeira, em `components/hero/camadas/Longe.tsx`;
- o tuiuiú, em `components/hero/camadas/Ave.tsx`;
- o ipê-amarelo, em `components/hero/camadas/Ipe.tsx`.

Os textos das três faixas do hero ficam em `content/inicio.ts`.

## 7. Imagens de compartilhamento e testes

A imagem que aparece quando alguém compartilha a Início é gerada a partir do hero de verdade, junto com o ícone da Apple:

```bash
npm run build && npx next start -p 3300
node scripts/og.mjs http://localhost:3300
```

O script grava `app/opengraph-image.png` e `app/apple-icon.png`. As imagens dos artigos são montadas sozinhas no build, com o título de cada um, por `app/blog/[slug]/opengraph-image.tsx`.

O domínio do site vem da variável `NEXT_PUBLIC_SITE_URL` (ex.: `https://empresa.com.br`). Sem ela, na Vercel, vale o domínio de produção do projeto. Ele é usado no canônico, no sitemap, no robots e nos dados do Google.

Por fim, rode tudo:

```bash
npm run test:all
```
````

- [ ] **Passo 4: Ver o verde**

Rode: `npx vitest run tests/unit/guia-conteudo.test.ts`
Esperado: PASS nos 3 testes. Se o segundo apontar um caminho que não existe, corrija o guia, nunca o teste.

- [ ] **Passo 5: Commit**

```bash
git add CONTEUDO.md tests/unit/guia-conteudo.test.ts
git commit -m "docs: guia para trocar o site para outro cliente

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 6: Lighthouse local

**Arquivos:**
- Criar: `scripts/lighthouse.mjs`
- Modificar: `.gitignore`, `package.json` (script `lighthouse`), `docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md` (seção 13: "Pendente para o Plano 5" passa a "Pendente para o Plano 6")

**Interfaces:**
- Consome: o site rodando com `NEXT_PUBLIC_SITE_URL` igual ao próprio endereço. Assim o canônico aponta para o mesmo domínio, e a auditoria de SEO não reclama de canônico para outro domínio.
- Produz: os relatórios `.lighthouse/{inicio,servico,artigo}-{celular,computador}.report.{html,json}` e a tabela de notas no terminal. O script sai com código 1 se Acessibilidade, Boas práticas ou SEO ficar abaixo de 95.

- [ ] **Passo 1: Ignorar os relatórios**

No fim de `.gitignore`, acrescente:

```
# relatórios do Lighthouse (o print vai para o portfólio)
/.lighthouse/
```

- [ ] **Passo 2: Escrever o script**

Crie `scripts/lighthouse.mjs`:

```js
// Roda o Lighthouse na Início, num serviço e num artigo, no celular e no computador (spec, seção 14).
// Relatórios em .lighthouse/, fora do Git. Sai com código 1 se Acessibilidade, Boas práticas ou SEO ficar
// abaixo de 95. O Desempenho local (WSL, sem GPU) só é anotado; a meta vale no endereço real.
// Uso, com o site rodando no próprio endereço (para o canônico apontar para ele):
//   NEXT_PUBLIC_SITE_URL=http://localhost:3300 npm run build && npx next start -p 3300
//   npm run lighthouse -- http://localhost:3300
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
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
const linhas = [];
for (const [pagina, caminho] of Object.entries(PAGINAS)) {
  for (const [formato, extra] of Object.entries(FORMATOS)) {
    const saida = `.lighthouse/${pagina}-${formato}`;
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
      { stdio: "inherit", env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
    );
    const relatorio = JSON.parse(readFileSync(`${saida}.report.json`, "utf8"));
    const notas = Object.fromEntries(
      Object.entries(CATEGORIAS).map(([id, nome]) => [nome, Math.round(relatorio.categories[id].score * 100)]),
    );
    linhas.push({ pagina, formato, ...notas });
  }
}
console.table(linhas);
const abaixo = linhas.filter((l) => PORTAO.some((nome) => l[nome] < 95));
if (abaixo.length) {
  console.error("Abaixo de 95:", abaixo.map((l) => `${l.pagina} no ${l.formato}`).join(", "));
  process.exitCode = 1;
}
```

Em `package.json`, nos `scripts`, acrescente depois de `"test:all"`:

```json
    "lighthouse": "node scripts/lighthouse.mjs"
```

- [ ] **Passo 3: Rodar**

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3300 npm run build && (npx next start -p 3300 > /dev/null 2>&1 &) && sleep 4
npm run lighthouse -- http://localhost:3300
pkill -f "next start -p 3300"
```

Esperado: a tabela com 6 linhas e código de saída 0, com Acessibilidade, Boas práticas e SEO em 95 ou mais em todas. Anote as 24 notas no registro da execução.

- [ ] **Passo 4: Corrigir o que ficou abaixo de 95**

Se o script sair com código 1:
1. abra o `.report.html` da linha que falhou e leia as auditorias reprovadas da categoria;
2. corrija a causa no código, com um teste que trave a correção quando ela for de comportamento (por exemplo, um atributo que faltava num elemento);
3. rode de novo os passos 3 e 4 até o código de saída ser 0.

Cada correção vira um commit `fix:` próprio, com o nome da auditoria na mensagem.

Se o Desempenho local ficar abaixo de 95, leia as três maiores oportunidades do relatório do celular e anote no registro. A meta oficial é medida no endereço real, no Plano 6. Só corrija agora o que o relatório apontar como problema do código, como imagem sem tamanho ou script que bloqueia a página, e não a lentidão da máquina.

- [ ] **Passo 5: Atualizar a spec**

Em `docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md`, seção 13, troque `**Pendente para o Plano 5:**` por `**Pendente para o Plano 6:**`.

- [ ] **Passo 6: A bateria inteira**

Rode: `npm run lint && npm run typecheck && npm run test:all`
Esperado: PASS em tudo, com os testes novos de SEO, sitemap e dados estruturados.

- [ ] **Passo 7: Commit**

```bash
git add .gitignore package.json scripts/lighthouse.mjs docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md
git commit -m "chore: rodada de Lighthouse local, com os relatórios fora do Git

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Fica para o Plano 6 (No ar)

- Login na Vercel e projeto ligado ao repositório, com `ipe-solar.vercel.app` (passo do usuário).
- Integração `resend/resend-email` do Marketplace (passo do usuário). Depois, o envio real em `lib/email.ts`, seguindo a skill que a integração instala. Ele substitui o `transporteIndisponivel`, que ainda cita o Plano 5 na mensagem de log.
- Primeira publicação, `vercel env pull` e formulário real chegando no e-mail do autor.
- Lighthouse no endereço real, nas três páginas e nos dois formatos, com o print para o portfólio.
- A meta de quadros do hero (no máximo 2% acima de 33 ms) conferida num aparelho de verdade.
- O validador de dados estruturados e o Rich Results Test no endereço real.
- README do projeto e a entrada no portfólio (`content/projects.ts`), tirando o provisório "Ledger".
