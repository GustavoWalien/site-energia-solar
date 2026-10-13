# Plano 1 (Fundação): plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar o progresso.

**Objetivo:** deixar pronta a base do site da Ipê Solar, para os planos seguintes só acrescentarem páginas. A base inclui:
- ferramentas de teste;
- identidade visual (cores, fontes, foco);
- conteúdo tipado da empresa;
- barra do topo "placa de loja" com menu do celular;
- rodapé, botão flutuante de WhatsApp e aviso de projeto conceito.

**Arquitetura:**
- **Next.js 16 (App Router)** com `cacheComponents` e `ensureStatic = 'navigation'` no layout raiz: o site inteiro sai pronto no build.
- **Conteúdo:** os dados da empresa e os textos ficam em `content/`, com tipos em `content/tipos.ts`.
- **Lógica:** a lógica pura fica em `lib/`, com testes Vitest.
- **Componentes:** são de servidor. Só `MenuCelular` e `AvisoConceito` rodam no navegador, e só para melhorar o que já funciona sem JavaScript (`<details>` nativo e links `<a href>` reais).
- **Estilo:** tokens de cor e fonte no `@theme static` do Tailwind 4. O estilo de cada componente fica num `.css` ao lado dele, com classes prefixadas (`topo__`, `aviso__`, `rodape__`), importado no `globals.css`. Não usamos CSS Modules por causa da regra `*.css` do Turbopack.

**Stack:** Next.js 16.4, React 19.3, TypeScript, Tailwind CSS 4 (loader do Turbopack), `next/font/google`, Vitest 5.0.3, Playwright 1.64.0.

**Spec:** [docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md](../specs/2026-10-13-site-ipe-solar-design.md). Este plano cobre as seções 2, 3 (barra, rodapé, botão flutuante e aviso), 5, 12 (parte da base), 13 e 14 (ferramentas e testes da base). Textos em [docs/textos.md](../../textos.md).

## Roteiro dos planos

| Plano | O quê | Depende de |
|---|---|---|
| **1. Fundação (este)** | Testes, cores, fontes, conteúdo, barra placa, rodapé, WhatsApp e aviso | nada |
| 2. Início | Hero (port do protótipo v4), seções, simulador, perguntas, formulário com e-mail | 1 |
| 3. Páginas | Serviços (lista e 4 páginas), Sobre com equipe ilustrada, Contato com mapa, 404 | 1, 2 |
| 4. Blog | MDX, 3 artigos completos, capas, imagens de compartilhamento por artigo | 1 |
| 5. Google e publicação | Dados estruturados, sitemap, robots, imagem da Início, Lighthouse, Vercel, Resend, README, `CONTEUDO.md`, portfólio | 1 a 4 |

Cada plano é escrito depois que o anterior estiver executado, para aproveitar o que foi aprendido.

## Restrições globais

- Antes de usar qualquer API do Next, ler o guia correspondente em `node_modules/next/dist/docs/` (regra do `AGENTS.md`).
- Next.js 16.4 com App Router. `cacheComponents: true` e `partialPrefetching: true` já estão no `next.config.ts` e não mudam.
- O layout raiz exporta `export const ensureStatic = "navigation"`. Nenhuma página pode renderizar por visita: nada de `new Date()`, `cookies()` ou `headers()` em componentes de servidor.
- Só português do Brasil, com `<html lang="pt-BR">`.
- **Paleta exata:**

  | Token | Cor | Uso |
  |---|---|---|
  | `ipe` | `#F5B800` | amarelo da marca |
  | `ceu-claro` | `#D6EEFB` | fundo de apoio |
  | `ceu` | `#3FA2DB` | detalhes |
  | `profundo` | `#0E3557` | textos |
  | `mata` | `#1E4D3A` | verde |
  | `papel` | `#FAFAF5` | fundo |
  | `tinta-suave` | `#3B5573` | texto de apoio |
  | `rotulo` | `#1F6FA8` | rótulos |
  | `erro` | `#B42318` | mensagens de erro |

  Amarelo e azul-céu nunca são cor de texto sobre fundo claro.
- **Fontes:** Bricolage Grotesque para títulos (800 e 600), Figtree para textos (400, 500 e 600), JetBrains Mono 500 para rótulos. Sempre por `next/font/google`.
- **Forma:** contorno de 2,5 px `profundo`, sombra dura `0 5px 0 profundo`, raio de 16 a 22 px. A página nunca tem fundo `#fff` ou `#000` puro.
- **Foco visível:** contorno `profundo` sobre fundo claro e `ipe` sobre fundo escuro. Esta é uma correção da spec: o amarelo puro sobre o fundo claro tem contraste de 1,7:1 e some.
- **Acessibilidade:** contraste de texto de pelo menos 4,5:1; alvos de toque de pelo menos 44 px no celular; link "Pular para o conteúdo"; um H1 por página; movimento reduzido respeitado.
- **Animação:** só `transform` e `opacity`.
- **Texto:**
  - nenhum travessão;
  - nenhuma palavra de estoque (alavancar, robusto, empoderar, destravar, acionável, orientado a dados, solução, soluções, sinergia, escalável, mergulhar, elevar, testamento, panorama);
  - os textos vêm de `docs/textos.md`.
- **Modo conceito:** `content/config.ts` com `modoConceito: true`. Dados do autor:
  - nome: Gustavo Walien;
  - WhatsApp: `55 65 98122-2210`;
  - e-mail: `gustavowalien@gmail.com`;
  - portfólio: `https://github.com/GustavoWalien`;
  - mensagem: "Olá! Vi o site conceito da Ipê Solar e quero conversar sobre um site para o meu negócio."
- **Testes:**
  - `npm test` roda o Vitest (`tests/unit`);
  - `npm run test:e2e` roda o Playwright (`tests/e2e`) contra `npm run build && npx next start -p 3200`, com os projetos `desktop` (1440×900) e `mobile` (375×812);
  - `npm run test:all` roda os dois.
- **Git:** o trabalho acontece na branch `feat/fundacao`. Cada tarefa termina num commit, e toda mensagem termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `site-de-10k/`, `prototipos/` e `.superpowers/` continuam fora do Git, do lint e do `tsconfig` (isso já está feito).

## Foco da revisão

1. **Visitante sem JavaScript:**
   - o menu do celular precisa abrir, porque é um `<details>` nativo;
   - os links de WhatsApp precisam levar ao `wa.me` real.

   Teste na Tarefa 5.
2. **Usuário de teclado:**
   - o Tab começa em "Pular para o conteúdo";
   - o Esc fecha o menu e o aviso, e devolve o foco a quem abriu.

   Testes nas Tarefas 4, 5 e 6.
3. **Cliente real com o modo conceito desligado:**
   - o WhatsApp vai direto para a empresa, com a mensagem pedida e sem aviso;
   - o rodapé fica sem a linha de projeto conceito.

   Testes nas Tarefas 2 e 6.
4. **Nome de empresa longo, no uso como modelo:** a placa não pode quebrar linha nem empurrar a página no celular. O conteúdo limita o nome a 18 caracteres (Tarefa 3), e há o teste de rolagem lateral (Tarefa 5).
5. **WhatsApp tocado com o menu do celular aberto:** o menu fecha e o aviso abre por cima. Teste na Tarefa 6.

## Estrutura de arquivos

```
package.json                         scripts de teste e versões (modificar)
.gitignore                           relatórios de teste (modificar)
vitest.config.mts                    Vitest com o atalho @/
playwright.config.ts                 Playwright: build + start na porta 3200, desktop e mobile
app/globals.css                      tokens (@theme static), base, foco, pular, botão, movimento reduzido, imports dos .css (reescrever)
app/layout.tsx                       fontes, metadados base, ensureStatic, barra, rodapé, flutuante, aviso (reescrever)
app/page.tsx                         Início provisória até o Plano 2 (reescrever)
app/icon.svg                         ícone: a flor (criar; apagar app/favicon.ico)
content/tipos.ts                     tipos do conteúdo
content/config.ts                    modo conceito e dados do autor
content/empresa.ts                   dados da Ipê Solar
content/navegacao.ts                 links do menu e texto da chamada do topo
content/conceito.ts                  textos do aviso e do rodapé de projeto conceito
lib/site.ts                          endereço do site (SITE_URL)
lib/whatsapp.ts                      link wa.me a partir de um número
lib/contato.ts                       destinoWhatsapp: autor (com aviso) ou empresa (direto)
lib/conceito.ts                      linhaConceito: linha do rodapé, só no modo conceito
components/marca/Flor.tsx            logo (SVG)
components/marca/IconeWhatsapp.tsx   ícone (SVG)
components/layout/LinkWhatsapp.tsx   <a> com data-aviso no modo conceito
components/layout/BarraTopo.tsx      placa, links, chamada, ícones (+ barra-topo.css)
components/layout/MenuCelular.tsx    <details> com melhorias no navegador (cliente)
components/layout/WhatsappFlutuante.tsx  botão redondo fixo (+ whatsapp-flutuante.css)
components/layout/AvisoConceito.tsx  <dialog> do projeto conceito (cliente, + aviso-conceito.css)
components/layout/Rodape.tsx         rodapé (+ rodape.css)
tests/unit/site.test.ts · whatsapp.test.ts · contato.test.ts · conceito.test.ts
tests/unit/texto.test.ts · conteudo.test.ts · contraste.test.ts
tests/e2e/base.spec.ts · barra.spec.ts · whatsapp.spec.ts
public/*.svg                         apagar (arquivos de exemplo do create-next-app)
```

---

### Tarefa 1: Ferramentas de teste e endereço do site

**Arquivos:**
- Modificar: `package.json`, `.gitignore`
- Criar: `vitest.config.mts`, `playwright.config.ts`, `lib/site.ts`
- Teste: `tests/unit/site.test.ts`

**Interfaces:**
- Consome: nada.
- Produz: `resolveSiteUrl(env: Record<string, string | undefined>): string` e `SITE_URL: string` em `lib/site.ts`; os scripts `test`, `test:e2e`, `test:all`, `typecheck` e `lint`.

- [ ] **Passo 1: Criar a branch e guardar o que já está pronto**

As mudanças pendentes (pastas fora do Git, textos, spec e este plano) entram no primeiro commit.

```bash
git switch -c feat/fundacao
git add .gitignore eslint.config.mjs tsconfig.json docs/
git commit -m "docs: textos, especificação e plano 1 do site da Ipê Solar

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Passo 2: Instalar as ferramentas de teste**

```bash
npm install -D vitest@5.0.3 @playwright/test@1.64.0
```

Se o Playwright reclamar de navegador ausente, rode `npx playwright install chromium`.

- [ ] **Passo 3: Scripts e versão do Node no `package.json`**

Troque o bloco `"scripts"` e acrescente `"engines"` logo abaixo de `"private": true`:

```json
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "test:all": "npm test && npm run test:e2e"
  },
```

- [ ] **Passo 4: Relatórios de teste fora do Git**

Acrescente ao fim do `.gitignore`:

```gitignore

# relatórios de teste
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Passo 5: Configurar o Vitest**

Crie `vitest.config.mts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: { alias: [{ find: /^@\//, replacement: root }] },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
```

- [ ] **Passo 6: Configurar o Playwright**

Crie `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://localhost:3200", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: "npm run build && npx next start -p 3200",
    url: "http://localhost:3200/",
    reuseExistingServer: false,
    timeout: 240_000,
    env: { EMAIL_TRANSPORTE: "teste" },
  },
});
```

- [ ] **Passo 7: Escrever o teste que falha**

Crie `tests/unit/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("usa NEXT_PUBLIC_SITE_URL sem a barra final", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://ipesolar.com.br/" })).toBe("https://ipesolar.com.br");
  });

  it("usa o domínio de produção da Vercel", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "ipe-solar.vercel.app" })).toBe("https://ipe-solar.vercel.app");
  });

  it("NEXT_PUBLIC_SITE_URL vence o domínio da Vercel", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://a.com.br", VERCEL_PROJECT_PRODUCTION_URL: "b.vercel.app" }),
    ).toBe("https://a.com.br");
  });

  it("sem variáveis, cai no endereço padrão", () => {
    expect(resolveSiteUrl({})).toBe("https://ipe-solar.vercel.app");
  });
});
```

- [ ] **Passo 8: Rodar e ver falhar**

Rode: `npm test`
Esperado: FALHA, porque `lib/site` não existe.

- [ ] **Passo 9: Implementar**

Crie `lib/site.ts`:

```ts
// Só servidor. Na Vercel, VERCEL_PROJECT_PRODUCTION_URL vira o domínio próprio assim que ele for configurado.
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://ipe-solar.vercel.app";
}

export const SITE_URL = resolveSiteUrl(process.env);
```

- [ ] **Passo 10: Rodar e ver passar**

Rode: `npm test`
Esperado: PASSA, com 4 testes.

- [ ] **Passo 11: Commit**

```bash
git add package.json package-lock.json .gitignore vitest.config.mts playwright.config.ts lib/site.ts tests/unit/site.test.ts
git commit -m "test: Vitest, Playwright e endereço do site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: Tipos de conteúdo e destino do WhatsApp

**Arquivos:**
- Criar: `content/tipos.ts`, `lib/whatsapp.ts`, `lib/contato.ts`, `lib/conceito.ts`
- Teste: `tests/unit/whatsapp.test.ts`, `tests/unit/contato.test.ts`, `tests/unit/conceito.test.ts`

**Interfaces:**
- Consome: nada.
- Produz:
  - tipos `LinkMenu`, `Autor`, `Config`, `Horario`, `Numero`, `Empresa` e `TextosConceito` em `content/tipos.ts`;
  - `whatsappUrl(number: string, text?: string): string | null`;
  - `destinoWhatsapp(config: Config, empresa: Empresa, mensagem?: string): { href: string; aviso: boolean }`;
  - `linhaConceito(config: Config, textos: TextosConceito): { texto: string; href: string } | null`.

- [ ] **Passo 1: Escrever os tipos**

Crie `content/tipos.ts`:

```ts
export type LinkMenu = { rotulo: string; href: string };

export type Autor = {
  nome: string;
  /** Número com DDI e DDD, em qualquer formato. Ex.: "55 65 98122-2210". */
  whatsapp: string;
  mensagemWhatsapp: string;
  email: string;
  portfolio: string;
};

export type Config = {
  /** Ligado: empresa fictícia, contatos vão para o autor e os avisos aparecem. Desligado: cliente real. */
  modoConceito: boolean;
  autor: Autor;
};

export type Horario = { dias: string; horas: string };

export type Numero = { valor: string; rotulo: string };

export type Empresa = {
  nome: string;
  frase: string;
  cidade: string;
  estado: string;
  /** Título e descrição padrão (página Início e páginas sem metadados próprios). */
  seo: { titulo: string; descricao: string };
  /** WhatsApp da empresa. Só é usado com o modo conceito desligado. */
  whatsapp: string;
  mensagemWhatsapp: string;
  /** E-mail que recebe os pedidos. Só é usado com o modo conceito desligado. */
  emailPedidos: string;
  horario: Horario[];
  /** O mesmo horário no formato do schema.org, ex.: "Mo-Fr 07:00-17:00". */
  horarioSchema: string[];
  cidades: string[];
  numeros: Numero[];
  fundacao: { ano: number; bairro: string };
  mapa: { consulta: string; legenda: string };
};

export type TextosConceito = {
  aviso: {
    selo: string;
    titulo: string;
    texto: string;
    botaoAutor: string;
    botaoFechar: string;
    fecharRotulo: string;
  };
  rodape: string;
};
```

- [ ] **Passo 2: Escrever os testes que falham**

Crie `tests/unit/whatsapp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";

describe("whatsappUrl", () => {
  it("tira tudo que não é dígito", () => {
    expect(whatsappUrl("55 65 98122-2210")).toBe("https://wa.me/5565981222210");
  });

  it("codifica a mensagem", () => {
    expect(whatsappUrl("5565981222210", "Olá! Tudo bem?")).toBe(
      "https://wa.me/5565981222210?text=Ol%C3%A1!%20Tudo%20bem%3F",
    );
  });

  it("número vazio ou curto devolve null", () => {
    expect(whatsappUrl("")).toBeNull();
    expect(whatsappUrl("12345")).toBeNull();
  });
});
```

Crie `tests/unit/contato.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Autor, Config, Empresa } from "@/content/tipos";
import { destinoWhatsapp } from "@/lib/contato";

const autor: Autor = {
  nome: "Autor",
  whatsapp: "55 65 98122-2210",
  mensagemWhatsapp: "Vi o site conceito",
  email: "autor@exemplo.com",
  portfolio: "https://exemplo.com",
};

const empresa: Empresa = {
  nome: "Empresa",
  frase: "Frase",
  cidade: "Cuiabá",
  estado: "MT",
  seo: { titulo: "Título", descricao: "Descrição" },
  whatsapp: "55 65 3333-4444",
  mensagemWhatsapp: "Quero um orçamento",
  emailPedidos: "pedidos@empresa.com",
  horario: [],
  horarioSchema: [],
  cidades: [],
  numeros: [],
  fundacao: { ano: 2016, bairro: "Centro" },
  mapa: { consulta: "Cuiabá, MT", legenda: "Cuiabá-MT" },
};

describe("destinoWhatsapp", () => {
  it("no modo conceito vai para o autor, com a mensagem dele e com aviso", () => {
    const config: Config = { modoConceito: true, autor };
    expect(destinoWhatsapp(config, empresa, "Mensagem do simulador")).toEqual({
      href: "https://wa.me/5565981222210?text=Vi%20o%20site%20conceito",
      aviso: true,
    });
  });

  it("com o modo desligado vai para a empresa, com a mensagem pedida e sem aviso", () => {
    const config: Config = { modoConceito: false, autor };
    expect(destinoWhatsapp(config, empresa, "Conta de R$ 450")).toEqual({
      href: "https://wa.me/556533334444?text=Conta%20de%20R%24%20450",
      aviso: false,
    });
  });

  it("sem mensagem, usa a mensagem padrão da empresa", () => {
    const config: Config = { modoConceito: false, autor };
    expect(destinoWhatsapp(config, empresa).href).toBe("https://wa.me/556533334444?text=Quero%20um%20or%C3%A7amento");
  });

  it("número da empresa inválido para o build com uma mensagem clara", () => {
    const config: Config = { modoConceito: false, autor };
    expect(() => destinoWhatsapp(config, { ...empresa, whatsapp: "" })).toThrow(/content\/empresa\.ts/);
  });

  it("número do autor inválido para o build com uma mensagem clara", () => {
    const config: Config = { modoConceito: true, autor: { ...autor, whatsapp: "123" } };
    expect(() => destinoWhatsapp(config, empresa)).toThrow(/content\/config\.ts/);
  });
});
```

Crie `tests/unit/conceito.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Config, TextosConceito } from "@/content/tipos";
import { linhaConceito } from "@/lib/conceito";

const textos: TextosConceito = {
  aviso: { selo: "s", titulo: "t", texto: "x", botaoAutor: "a", botaoFechar: "f", fecharRotulo: "r" },
  rodape: "Projeto conceito de Autor.",
};
const autor = { nome: "Autor", whatsapp: "5565981222210", mensagemWhatsapp: "m", email: "a@b.com", portfolio: "https://exemplo.com" };

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
```

- [ ] **Passo 3: Rodar e ver falhar**

Rode: `npm test`
Esperado: FALHA, porque `lib/whatsapp`, `lib/contato` e `lib/conceito` não existem.

- [ ] **Passo 4: Implementar**

Crie `lib/whatsapp.ts`:

```ts
/** Link do wa.me a partir de um número em qualquer formato. Número inválido devolve null. */
export function whatsappUrl(number: string, text?: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  const url = `https://wa.me/${digits}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
```

Crie `lib/contato.ts`:

```ts
import type { Config, Empresa } from "@/content/tipos";
import { whatsappUrl } from "./whatsapp";

export type DestinoWhatsapp = {
  href: string;
  /** Verdadeiro no modo conceito: o clique abre o aviso antes de sair do site. */
  aviso: boolean;
};

export function destinoWhatsapp(config: Config, empresa: Empresa, mensagem?: string): DestinoWhatsapp {
  if (config.modoConceito) {
    const href = whatsappUrl(config.autor.whatsapp, config.autor.mensagemWhatsapp);
    if (!href) throw new Error("WhatsApp do autor inválido em content/config.ts");
    return { href, aviso: true };
  }
  const href = whatsappUrl(empresa.whatsapp, mensagem ?? empresa.mensagemWhatsapp);
  if (!href) throw new Error("WhatsApp da empresa inválido em content/empresa.ts");
  return { href, aviso: false };
}
```

Crie `lib/conceito.ts`:

```ts
import type { Config, TextosConceito } from "@/content/tipos";

/** Linha do rodapé que avisa que tudo é fictício. Fora do modo conceito, não existe. */
export function linhaConceito(config: Config, textos: TextosConceito): { texto: string; href: string } | null {
  if (!config.modoConceito) return null;
  return { texto: textos.rodape, href: config.autor.portfolio };
}
```

- [ ] **Passo 5: Rodar e ver passar**

Rode: `npm test`
Esperado: PASSA (site, whatsapp, contato e conceito).

- [ ] **Passo 6: Commit**

```bash
git add content/tipos.ts lib/whatsapp.ts lib/contato.ts lib/conceito.ts tests/unit/whatsapp.test.ts tests/unit/contato.test.ts tests/unit/conceito.test.ts
git commit -m "feat: tipos de conteúdo e destino do WhatsApp nos dois modos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 3: Conteúdo da Ipê Solar e portões de texto

**Arquivos:**
- Criar: `content/config.ts`, `content/empresa.ts`, `content/navegacao.ts`, `content/conceito.ts`
- Teste: `tests/unit/texto.test.ts`, `tests/unit/conteudo.test.ts`

**Interfaces:**
- Consome: os tipos de `content/tipos.ts` e `whatsappUrl` (Tarefa 2).
- Produz: `config: Config`, `empresa: Empresa`, `menu: LinkMenu[]`, `chamadaTopo: string` e `conceito: TextosConceito`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/unit/texto.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function arquivos(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

const ARQUIVOS = arquivos("content").filter((f) => /\.(ts|tsx|mdx)$/.test(f));

// Palavras de estoque, por radical, para pegar plurais e flexões.
const ESTOQUE =
  /(^|[^\p{L}])(alavanc|robust|empodera|destrava|acionáve|orientad[oa] a dados|soluç|sinergi|escaláve|mergulh|elevar|testamento|panorama)/iu;

describe("portão de texto", () => {
  it("encontra arquivos de conteúdo", () => {
    expect(ARQUIVOS.length).toBeGreaterThan(0);
  });

  for (const arquivo of ARQUIVOS) {
    it(`${arquivo}: sem travessão e sem palavra de estoque`, () => {
      const visivel = readFileSync(arquivo, "utf8")
        .split("\n")
        .filter((linha) => !linha.trim().startsWith("//"))
        .join("\n");
      expect(visivel.includes("—"), "travessão (—) encontrado").toBe(false);
      expect(visivel.match(ESTOQUE)?.[0] ?? null).toBeNull();
    });
  }
});
```

Crie `tests/unit/conteudo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { whatsappUrl } from "@/lib/whatsapp";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe("conteúdo da empresa", () => {
  it("o WhatsApp e o e-mail do autor são válidos", () => {
    expect(whatsappUrl(config.autor.whatsapp)).not.toBeNull();
    expect(config.autor.email).toMatch(EMAIL);
  });

  it("com o modo conceito desligado, a empresa precisa de WhatsApp e e-mail de verdade", () => {
    if (config.modoConceito) return;
    expect(whatsappUrl(empresa.whatsapp)).not.toBeNull();
    expect(empresa.emailPedidos).toMatch(EMAIL);
  });

  it("o nome cabe na placa do topo (até 18 caracteres)", () => {
    expect(empresa.nome.length).toBeLessThanOrEqual(18);
  });

  it("título padrão até 60 caracteres com o sufixo e descrição até 160", () => {
    expect(`${empresa.seo.titulo} | ${empresa.nome}`.length).toBeLessThanOrEqual(60);
    expect(empresa.seo.descricao.length).toBeLessThanOrEqual(160);
  });

  it("horário legível e no formato do schema.org, em pares", () => {
    expect(empresa.horario.length).toBeGreaterThan(0);
    expect(empresa.horarioSchema).toHaveLength(empresa.horario.length);
    for (const h of empresa.horarioSchema) {
      expect(h).toMatch(/^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))? \d{2}:\d{2}-\d{2}:\d{2}$/);
    }
  });

  it("tem cidades e exatamente três números", () => {
    expect(empresa.cidades.length).toBeGreaterThan(0);
    expect(empresa.numeros).toHaveLength(3);
  });

  it("o menu aponta para rotas internas únicas", () => {
    const hrefs = menu.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href).toMatch(/^\/[a-z-]+$/);
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npm test`
Esperado: FALHA em `conteudo.test.ts`, porque `content/config`, `content/empresa` e `content/navegacao` ainda não existem. O portão de texto já passa, porque encontra o `tipos.ts`.

- [ ] **Passo 3: Escrever o conteúdo**

Crie `content/config.ts`:

```ts
import type { Config } from "./tipos";

export const config: Config = {
  modoConceito: true,
  autor: {
    nome: "Gustavo Walien",
    whatsapp: "55 65 98122-2210",
    mensagemWhatsapp: "Olá! Vi o site conceito da Ipê Solar e quero conversar sobre um site para o meu negócio.",
    email: "gustavowalien@gmail.com",
    portfolio: "https://github.com/GustavoWalien",
  },
};
```

Crie `content/empresa.ts`:

```ts
import type { Empresa } from "./tipos";

export const empresa: Empresa = {
  nome: "Ipê Solar",
  frase: "Energia solar em Cuiabá e região",
  cidade: "Cuiabá",
  estado: "MT",
  seo: {
    titulo: "Energia solar em Cuiabá",
    descricao:
      "Projeto, instalação e liberação na Energisa para casas, empresas e fazendas em Cuiabá e região. Simule sua economia e peça seu orçamento.",
  },
  // Empresa fictícia: sem número nem e-mail reais. Preencha os dois ao desligar o modo conceito.
  whatsapp: "",
  mensagemWhatsapp: "Olá! Quero um orçamento de energia solar.",
  emailPedidos: "",
  horario: [
    { dias: "Segunda a sexta", horas: "7h às 17h" },
    { dias: "Sábado", horas: "7h às 11h" },
  ],
  horarioSchema: ["Mo-Fr 07:00-17:00", "Sa 07:00-11:00"],
  cidades: [
    "Cuiabá",
    "Várzea Grande",
    "Chapada dos Guimarães",
    "Santo Antônio de Leverger",
    "Nossa Senhora do Livramento",
    "Poconé",
    "Jangada",
    "Acorizal",
    "Barão de Melgaço",
  ],
  numeros: [
    { valor: "1.200", rotulo: "sistemas instalados" },
    { valor: "8 MWp", rotulo: "em operação" },
    { valor: "9", rotulo: "cidades atendidas" },
  ],
  fundacao: { ano: 2016, bairro: "Coxipó" },
  mapa: { consulta: "Cuiabá, MT", legenda: "Cuiabá-MT · atendimento no local com hora marcada" },
};
```

Crie `content/navegacao.ts`:

```ts
import type { LinkMenu } from "./tipos";

export const menu: LinkMenu[] = [
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: "Sobre", href: "/sobre" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "/contato" },
];

export const chamadaTopo = "Peça seu orçamento";
```

Crie `content/conceito.ts`:

```ts
import type { TextosConceito } from "./tipos";

export const conceito: TextosConceito = {
  aviso: {
    selo: "Projeto conceito",
    titulo: "Este é um projeto conceito.",
    texto:
      "A Ipê Solar não existe. Este site foi feito por Gustavo Walien para mostrar como um negócio local pode aparecer no Google e receber pedidos pelo WhatsApp. Gostou? Fale comigo.",
    botaoAutor: "Falar com quem fez este site",
    botaoFechar: "Continuar vendo o site",
    fecharRotulo: "Fechar aviso",
  },
  rodape: "Projeto conceito de Gustavo Walien. Empresa, pessoas, números e depoimentos fictícios.",
};
```

- [ ] **Passo 4: Rodar e ver passar**

Rode: `npm test`
Esperado: PASSA. O portão de texto cobre os 5 arquivos de `content/`.

- [ ] **Passo 5: Commit**

```bash
git add content/config.ts content/empresa.ts content/navegacao.ts content/conceito.ts tests/unit/texto.test.ts tests/unit/conteudo.test.ts
git commit -m "feat: conteúdo da Ipê Solar com portões de texto e de integridade

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 4: Identidade visual e layout raiz

**Arquivos:**
- Reescrever: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- Criar: `app/icon.svg`
- Apagar: `app/favicon.ico`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- Teste: `tests/unit/contraste.test.ts`, `tests/e2e/base.spec.ts`

**Interfaces:**
- Consome: `empresa.seo`, `empresa.nome` (Tarefa 3) e `SITE_URL` (Tarefa 1).
- Produz:
  - utilitários do Tailwind a partir dos tokens: `bg-ipe`, `text-profundo`, `text-tinta-suave`, `text-rotulo`, `font-display`, `font-mono`, `shadow-dura`;
  - variáveis CSS `--color-*`, `--font-*`, `--ease-saida` e `--ease-meio`;
  - as classes globais `.pular`, `.escuro`, `.botao` e `.botao--ipe`;
  - o `<main id="conteudo">` em que toda página entra.

  O estilo de cada componente fica num arquivo `.css` ao lado dele, importado no topo do `globals.css`, com classes prefixadas pelo nome do componente. Não use CSS Modules: a regra `*.css` do Turbopack no `next.config.ts` trata todo `.css` como CSS comum.

- [ ] **Passo 1: Ler os guias do Next**

Leia `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` e `.../14-metadata-and-og-images.md`, e também `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/ensureStatic.md`.

- [ ] **Passo 2: Escrever o teste de contraste que falha**

Crie `tests/unit/contraste.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");
const inicio = css.indexOf("@theme static {");
const tema = css.slice(inicio, css.indexOf("}", inicio));
const cor: Record<string, string> = Object.fromEntries(
  [...tema.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
);

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contraste(a: string, b: string): number {
  const [alto, baixo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alto! + 0.05) / (baixo! + 0.05);
}

describe("contraste das cores da marca", () => {
  it("lê os tokens do @theme", () => {
    expect(Object.keys(cor)).toEqual(
      expect.arrayContaining(["ipe", "ceu-claro", "ceu", "profundo", "mata", "papel", "tinta-suave", "rotulo", "erro"]),
    );
  });

  it.each([
    ["profundo", "papel", 4.5],
    ["tinta-suave", "papel", 4.5],
    ["rotulo", "papel", 4.5],
    ["erro", "papel", 4.5],
    ["profundo", "ceu-claro", 4.5],
    ["profundo", "ipe", 4.5],
    ["papel", "profundo", 4.5],
    ["ceu-claro", "profundo", 4.5],
    ["ipe", "profundo", 4.5],
  ])("%s sobre %s ≥ %s:1", (frente, fundo, minimo) => {
    expect(contraste(cor[frente]!, cor[fundo]!)).toBeGreaterThanOrEqual(minimo);
  });
});
```

- [ ] **Passo 3: Rodar e ver falhar**

Rode: `npm test -- tests/unit/contraste.test.ts`
Esperado: FALHA. O `globals.css` atual não tem `@theme static`, então nenhum token é lido.

- [ ] **Passo 4: Reescrever `app/globals.css`**

Os imports dos componentes entram nas Tarefas 5 e 6, logo abaixo da linha do Tailwind.

```css
@import "tailwindcss";

/* static: publica todas as variáveis, mesmo as que só aparecem nos .css dos componentes */
@theme static {
  --color-ipe: #F5B800;
  --color-ceu-claro: #D6EEFB;
  --color-ceu: #3FA2DB;
  --color-profundo: #0E3557;
  --color-mata: #1E4D3A;
  --color-papel: #FAFAF5;
  --color-tinta-suave: #3B5573;
  --color-rotulo: #1F6FA8;
  --color-erro: #B42318;

  --font-display: var(--fonte-display), system-ui, sans-serif;
  --font-texto: var(--fonte-texto), system-ui, sans-serif;
  --font-mono: var(--fonte-mono), ui-monospace, monospace;

  --ease-saida: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-meio: cubic-bezier(0.65, 0, 0.35, 1);

  --shadow-dura: 0 5px 0 var(--color-profundo);
}

@layer base {
  html,
  body {
    overflow-x: hidden;
  }
  html,
  body {
    overflow-x: clip;
  }
  html {
    scroll-padding-top: 88px;
    -webkit-text-size-adjust: 100%;
  }
  body {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    background: var(--color-papel);
    color: var(--color-profundo);
    font-family: var(--font-texto);
    font-size: 1.0625rem;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  main {
    flex: 1;
  }
  #conteudo:focus {
    outline: none;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
  }
  a {
    color: inherit;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }
  /* foco azul no claro; dentro de .escuro, amarelo */
  :focus-visible {
    outline: 3px solid var(--color-profundo);
    outline-offset: 3px;
    border-radius: 6px;
  }
  .escuro :focus-visible {
    outline-color: var(--color-ipe);
  }
}

@layer components {
  .pular {
    position: absolute;
    left: -999px;
    top: 8px;
    z-index: 50;
    padding: 10px 14px;
    border-radius: 8px;
    background: var(--color-profundo);
    color: var(--color-papel);
  }
  .pular:focus {
    left: 8px;
  }

  .botao {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 12px 20px;
    border-radius: 999px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition:
      transform 0.3s var(--ease-saida),
      box-shadow 0.3s var(--ease-saida);
  }
  .botao--ipe {
    background: var(--color-ipe);
    color: var(--color-profundo);
    border: 2.5px solid var(--color-profundo);
    box-shadow: var(--shadow-dura);
  }
  .botao--ipe:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 var(--color-profundo);
  }
  .botao--ipe:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 var(--color-profundo);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Passo 5: Rodar o teste de contraste e ver passar**

Rode: `npm test -- tests/unit/contraste.test.ts`
Esperado: PASSA, com 10 testes.

- [ ] **Passo 6: Escrever o teste de ponta a ponta que falha**

Crie `tests/e2e/base.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("página em português, com um H1 na fonte da marca e link de pular", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page).toHaveTitle("Energia solar em Cuiabá | Ipê Solar");

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Bricolage/i);

  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await pular.press("Enter");
  await expect(page.locator("#conteudo")).toBeFocused();

  expect(erros).toEqual([]);
});

test("sem rolagem lateral", async ({ page }) => {
  await page.goto("/");
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});
```

- [ ] **Passo 7: Rodar e ver falhar**

Rode: `npm run test:e2e -- tests/e2e/base.spec.ts`
Esperado: FALHA. O `lang` ainda é `en`, o título é "Create Next App" e não há link de pular.

- [ ] **Passo 8: Reescrever `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { empresa } from "@/content/empresa";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--fonte-display", display: "swap" });
const texto = Figtree({ subsets: ["latin"], variable: "--fonte-texto", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "500", variable: "--fonte-mono", display: "swap" });

// O site inteiro sai pronto no build: nenhuma página renderiza por visita.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${empresa.seo.titulo} | ${empresa.nome}`, template: `%s | ${empresa.nome}` },
  description: empresa.seo.descricao,
  openGraph: { type: "website", locale: "pt_BR", siteName: empresa.nome },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0E3557" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${texto.variable} ${mono.variable}`}>
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

- [ ] **Passo 9: Reescrever `app/page.tsx` (Início provisória até o Plano 2)**

```tsx
export default function Inicio() {
  return (
    <section className="mx-auto w-[min(1120px,calc(100%-32px))] pt-36 pb-32">
      <p className="font-mono text-[0.78rem] tracking-[0.14em] text-rotulo uppercase">Em construção</p>
      <h1 className="mt-4 max-w-[16ch] text-5xl leading-none font-extrabold">Energia solar em Cuiabá.</h1>
      <p className="mt-5 max-w-[60ch] text-tinta-suave">
        A página Início chega no Plano 2, com o hero animado, o simulador e o formulário.
      </p>
    </section>
  );
}
```

- [ ] **Passo 10: Trocar o ícone e apagar os arquivos de exemplo**

Crie `app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="#F5B800" stroke="#0E3557" stroke-width="1.6"><ellipse cx="16" cy="7" rx="4" ry="6"/><ellipse cx="16" cy="25" rx="4" ry="6"/><ellipse cx="7" cy="16" rx="6" ry="4"/><ellipse cx="25" cy="16" rx="6" ry="4"/></g><circle cx="16" cy="16" r="5" fill="#0E3557"/></svg>
```

```bash
git rm app/favicon.ico public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Passo 11: Rodar tudo e ver passar**

Rode: `npm test && npm run test:e2e -- tests/e2e/base.spec.ts`
Esperado: PASSA nos projetos `desktop` e `mobile`.

- [ ] **Passo 12: Commit**

```bash
git add app/globals.css app/layout.tsx app/page.tsx app/icon.svg tests/unit/contraste.test.ts tests/e2e/base.spec.ts
git commit -m "feat: tokens, fontes, foco e layout raiz estático

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: Barra do topo "placa de loja" e menu do celular

**Arquivos:**
- Criar:
  - `components/marca/Flor.tsx`, `components/marca/IconeWhatsapp.tsx`;
  - `components/layout/LinkWhatsapp.tsx`;
  - `components/layout/BarraTopo.tsx`, `components/layout/barra-topo.css`;
  - `components/layout/MenuCelular.tsx`.
- Modificar: `app/globals.css` (import), `app/layout.tsx` (barra)
- Teste: `tests/e2e/barra.spec.ts`

**Interfaces:**
- Consome: `destinoWhatsapp` (Tarefa 2), `config`, `empresa`, `menu` e `chamadaTopo` (Tarefa 3), e a classe `.botao--ipe` (Tarefa 4).
- Produz:
  - `<Flor className? />` e `<IconeWhatsapp className? />`;
  - `<LinkWhatsapp id? className? mensagem? rotulo?>`, que renderiza `<a href={wa.me} target="_blank" rel="noopener" data-aviso>`, com `data-aviso` só no modo conceito;
  - `<BarraTopo />` com `id="topo"`;
  - `<MenuCelular />`.

  O Plano 2 vai usar o `id="topo"` e a classe `.topo` para os estados sobre o hero.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/e2e/barra.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("barra do topo", () => {
  test("a placa mostra o nome, leva à Início e não quebra linha", async ({ page }) => {
    await page.goto("/");
    const placa = page.getByRole("banner").getByRole("link", { name: "Ipê Solar" });
    await expect(placa).toBeVisible();
    await expect(placa).toHaveAttribute("href", "/");
    expect((await placa.boundingBox())!.height).toBeLessThan(70);
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra).toBeLessThanOrEqual(0);
  });

  test("no computador: links e chamada para o WhatsApp do autor", async ({ page, isMobile }) => {
    test.skip(isMobile, "só no computador");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const rotulo of ["Serviços", "Sobre", "Blog", "Contato"]) {
      await expect(nav.getByRole("link", { name: rotulo })).toBeVisible();
    }
    const chamada = page.getByRole("link", { name: "Peça seu orçamento" });
    await expect(chamada).toHaveAttribute("href", /^https:\/\/wa\.me\/5565981222210\?text=/);
    await expect(chamada).toHaveAttribute("data-aviso", "");
  });

  test("no celular: o menu abre, fecha com Esc e devolve o foco", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeHidden();
    const botao = page.locator("summary[aria-label='Menu']");
    await botao.click();
    const painel = page.getByRole("navigation", { name: "Menu" });
    await expect(painel.getByRole("link", { name: "Contato" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();
    await expect(botao).toBeFocused();
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("o menu do celular abre e o WhatsApp tem link real", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await page.locator("summary[aria-label='Menu']").click();
    await expect(page.getByRole("navigation", { name: "Menu" }).getByRole("link", { name: "Serviços" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Fale no WhatsApp" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/5565981222210/,
    );
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npm run test:e2e -- tests/e2e/barra.spec.ts`
Esperado: FALHA, porque ainda não existe `banner` (cabeçalho).

- [ ] **Passo 3: Criar os desenhos da marca**

Crie `components/marca/Flor.tsx`:

```tsx
/** A flor do ipê, logo da marca. Decorativa: o nome da empresa vem em texto ao lado. */
export function Flor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g fill="#FAFAF5" stroke="#0E3557" strokeWidth="1.6">
        <ellipse cx="16" cy="7" rx="4" ry="6" />
        <ellipse cx="16" cy="25" rx="4" ry="6" />
        <ellipse cx="7" cy="16" rx="6" ry="4" />
        <ellipse cx="25" cy="16" rx="6" ry="4" />
      </g>
      <circle cx="16" cy="16" r="5" fill="#0E3557" />
    </svg>
  );
}
```

Crie `components/marca/IconeWhatsapp.tsx`:

```tsx
/** Ícone do WhatsApp. Decorativo: o link que o usa leva o nome acessível. */
export function IconeWhatsapp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"
      />
    </svg>
  );
}
```

- [ ] **Passo 4: Criar o link de WhatsApp**

Crie `components/layout/LinkWhatsapp.tsx`:

```tsx
import type { ReactNode } from "react";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { destinoWhatsapp } from "@/lib/contato";

type Props = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Mensagem pronta para a empresa. No modo conceito vale a mensagem do autor. */
  mensagem?: string;
  /** Nome acessível, quando o conteúdo é só um ícone. */
  rotulo?: string;
};

/** Link de WhatsApp. No modo conceito, o clique abre o aviso (AvisoConceito) antes de sair do site. */
export function LinkWhatsapp({ children, id, className, mensagem, rotulo }: Props) {
  const destino = destinoWhatsapp(config, empresa, mensagem);
  return (
    <a
      id={id}
      className={className}
      href={destino.href}
      target="_blank"
      rel="noopener"
      aria-label={rotulo}
      data-aviso={destino.aviso ? "" : undefined}
    >
      {children}
    </a>
  );
}
```

- [ ] **Passo 5: Criar o menu do celular**

Crie `components/layout/MenuCelular.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { menu } from "@/content/navegacao";

/** Menu do celular. Funciona sem JavaScript (<details>); com ele, fecha no Esc, no clique fora e no link. */
export function MenuCelular() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const menuEl = ref.current;
    if (!menuEl) return;
    const fechar = (devolverFoco: boolean) => {
      if (!menuEl.open) return;
      menuEl.open = false;
      if (devolverFoco) menuEl.querySelector("summary")?.focus();
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar(true);
    };
    const aoClicarFora = (e: MouseEvent) => {
      if (!menuEl.contains(e.target as Node)) fechar(false);
    };
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("click", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("click", aoClicarFora);
    };
  }, []);

  return (
    <details className="topo__menu" ref={ref}>
      <summary className="topo__icone" aria-label="Menu">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </summary>
      <nav className="topo__painel" aria-label="Menu">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
          >
            {item.rotulo}
          </Link>
        ))}
      </nav>
    </details>
  );
}
```

- [ ] **Passo 6: Criar a barra do topo**

Crie `components/layout/BarraTopo.tsx`:

```tsx
import Link from "next/link";
import { Flor } from "@/components/marca/Flor";
import { IconeWhatsapp } from "@/components/marca/IconeWhatsapp";
import { empresa } from "@/content/empresa";
import { chamadaTopo, menu } from "@/content/navegacao";
import { LinkWhatsapp } from "./LinkWhatsapp";
import { MenuCelular } from "./MenuCelular";

/** Barra do topo: a placa amarela pendurada na faixa azul, links, chamada e, no celular, ícones e menu. */
export function BarraTopo() {
  return (
    <header className="topo" id="topo">
      <Link className="topo__placa" href="/">
        <Flor className="topo__flor" />
        {empresa.nome}
      </Link>
      <nav className="topo__links" aria-label="Principal">
        {menu.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.rotulo}
          </Link>
        ))}
      </nav>
      <LinkWhatsapp className="botao botao--ipe topo__chamada">{chamadaTopo}</LinkWhatsapp>
      <LinkWhatsapp className="topo__icone topo__zap" rotulo="Fale no WhatsApp">
        <IconeWhatsapp />
      </LinkWhatsapp>
      <MenuCelular />
    </header>
  );
}
```

Crie `components/layout/barra-topo.css`:

```css
@layer components {
  .topo {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 20;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 26px;
    padding: 0 max(16px, calc((100vw - 1120px) / 2));
    border-top: 6px solid var(--color-profundo);
    background: var(--color-papel);
    color: var(--color-profundo);
    box-shadow: 0 2.5px 0 var(--color-profundo);
    transition:
      background-color 0.35s var(--ease-saida),
      color 0.35s var(--ease-saida),
      box-shadow 0.35s var(--ease-saida);
  }

  /* a placa pendurada: sem borda em cima, balança ao carregar e no hover */
  .topo__placa {
    flex: none;
    align-self: flex-start;
    margin-top: -6px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    padding: 17px 16px 13px;
    background: var(--color-ipe);
    color: var(--color-profundo);
    border: 2.5px solid var(--color-profundo);
    border-top: 0;
    border-radius: 0 0 16px 16px;
    box-shadow: var(--shadow-dura);
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.22rem;
    line-height: 1;
    letter-spacing: -0.01em;
    text-decoration: none;
    transform-origin: 50% 0;
    animation: placa-balancar 1.5s var(--ease-saida) 0.25s both;
  }
  .topo__placa:hover {
    animation: placa-balancar-de-novo 1s var(--ease-saida);
  }
  .topo__flor {
    width: 26px;
    height: 26px;
  }

  .topo__links {
    display: flex;
    gap: 26px;
    margin-left: auto;
    font-weight: 600;
  }
  .topo__links a {
    padding: 6px 1px;
    text-decoration: none;
    background: linear-gradient(currentColor, currentColor) no-repeat 0 100% / 0 2.5px;
    transition: background-size 0.3s var(--ease-saida);
  }
  .topo__links a:hover {
    background-size: 100% 2.5px;
  }
  .topo__chamada {
    font-size: 0.95rem;
    padding: 11px 18px;
  }

  .topo__icone {
    display: none;
    width: 44px;
    height: 44px;
    place-items: center;
    border-radius: 12px;
    border: 2.5px solid currentColor;
    background: transparent;
    color: inherit;
    cursor: pointer;
    list-style: none;
  }
  .topo__icone::-webkit-details-marker {
    display: none;
  }
  .topo__icone svg {
    width: 20px;
    height: 20px;
  }
  .topo__zap {
    margin-left: auto;
    background: var(--color-ipe);
    border-color: var(--color-profundo);
    color: var(--color-profundo);
    box-shadow: 0 3px 0 var(--color-profundo);
  }

  .topo__menu {
    display: none;
  }
  .topo__painel {
    position: absolute;
    top: calc(100% + 10px);
    left: 16px;
    right: 16px;
    display: grid;
    padding: 8px;
    background: var(--color-papel);
    border: 2.5px solid var(--color-profundo);
    border-radius: 16px;
    box-shadow: 0 6px 0 var(--color-profundo);
  }
  .topo__painel a {
    padding: 14px 12px;
    border-radius: 10px;
    color: var(--color-profundo);
    font-weight: 600;
    text-decoration: none;
  }
  .topo__painel a:hover {
    background: var(--color-ceu-claro);
  }

  @media (max-width: 860px) {
    .topo {
      height: 58px;
      gap: 10px;
    }
    .topo__links,
    .topo__chamada {
      display: none;
    }
    .topo__icone {
      display: grid;
    }
    .topo__menu {
      display: block;
    }
    .topo__placa {
      font-size: 1.05rem;
      padding: 14px 12px 11px;
      gap: 6px;
    }
    .topo__flor {
      width: 22px;
      height: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .topo__placa,
    .topo__placa:hover {
      animation: none;
    }
  }
}

@keyframes placa-balancar {
  0% { transform: rotate(6deg); }
  28% { transform: rotate(-4deg); }
  52% { transform: rotate(2.2deg); }
  76% { transform: rotate(-1deg); }
  100% { transform: rotate(0); }
}
@keyframes placa-balancar-de-novo {
  0% { transform: rotate(0); }
  25% { transform: rotate(-3deg); }
  55% { transform: rotate(1.6deg); }
  80% { transform: rotate(-0.6deg); }
  100% { transform: rotate(0); }
}
```

- [ ] **Passo 7: Ligar a barra no layout e o CSS no `globals.css`**

Em `app/globals.css`, acrescente logo abaixo de `@import "tailwindcss";`:

```css
@import "../components/layout/barra-topo.css";
```

Em `app/layout.tsx`, importe a barra e coloque-a logo depois do link "Pular para o conteúdo":

```tsx
import { BarraTopo } from "@/components/layout/BarraTopo";
```

```tsx
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <BarraTopo />
        <main id="conteudo" tabIndex={-1}>
```

- [ ] **Passo 8: Rodar e ver passar**

Rode: `npm run test:e2e -- tests/e2e/barra.spec.ts tests/e2e/base.spec.ts`
Esperado: PASSA nos projetos `desktop` e `mobile`. Nos testes pulados por projeto, aparece `skipped`.

- [ ] **Passo 9: Commit**

```bash
git add components/marca components/layout/LinkWhatsapp.tsx components/layout/MenuCelular.tsx components/layout/BarraTopo.tsx components/layout/barra-topo.css app/globals.css app/layout.tsx tests/e2e/barra.spec.ts
git commit -m "feat: barra do topo placa de loja com menu do celular

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 6: Aviso do projeto conceito, WhatsApp flutuante e rodapé

**Arquivos:**
- Criar:
  - `components/layout/AvisoConceito.tsx`, `components/layout/aviso-conceito.css`;
  - `components/layout/WhatsappFlutuante.tsx`, `components/layout/whatsapp-flutuante.css`;
  - `components/layout/Rodape.tsx`, `components/layout/rodape.css`.
- Modificar: `app/globals.css` (imports), `app/layout.tsx` (rodapé, flutuante e aviso)
- Teste: `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consome: `LinkWhatsapp`, `Flor` e `IconeWhatsapp` (Tarefa 5), `destinoWhatsapp` e `linhaConceito` (Tarefa 2), e `conceito`, `config`, `empresa` e `menu` (Tarefa 3).
- Produz:
  - `<AvisoConceito textos={conceito.aviso} hrefAutor={string} />`, que intercepta cliques em `a[data-aviso]` em qualquer lugar da página;
  - `<WhatsappFlutuante />`, com `id="whatsapp-flutuante"`. O Plano 2 vai escondê-lo durante o hero;
  - `<Rodape />`.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/e2e/whatsapp.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const LINK_AUTOR =
  "https://wa.me/5565981222210?text=Ol%C3%A1!%20Vi%20o%20site%20conceito%20da%20Ip%C3%AA%20Solar%20e%20quero%20conversar%20sobre%20um%20site%20para%20o%20meu%20neg%C3%B3cio.";

test.describe("WhatsApp no modo conceito", () => {
  test("o botão flutuante abre o aviso com foco no contato do autor, e o Esc devolve o foco", async ({ page }) => {
    await page.goto("/");
    const flutuante = page.locator("#whatsapp-flutuante");
    await flutuante.click();
    const aviso = page.getByRole("dialog", { name: "Este é um projeto conceito." });
    await expect(aviso).toBeVisible();
    const autor = aviso.getByRole("link", { name: "Falar com quem fez este site" });
    await expect(autor).toBeFocused();
    await expect(autor).toHaveAttribute("href", LINK_AUTOR);
    await page.keyboard.press("Escape");
    await expect(aviso).toBeHidden();
    await expect(flutuante).toBeFocused();
  });

  test("fecha pelo botão de continuar e pelo clique fora da janela", async ({ page }) => {
    await page.goto("/");
    const aviso = page.getByRole("dialog");
    await page.locator("#whatsapp-flutuante").click();
    await aviso.getByRole("button", { name: "Continuar vendo o site" }).click();
    await expect(aviso).toBeHidden();
    await page.locator("#whatsapp-flutuante").click();
    await expect(aviso).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(aviso).toBeHidden();
  });

  test("com o menu do celular aberto, o WhatsApp fecha o menu e abre o aviso", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await page.locator("summary[aria-label='Menu']").click();
    await page.getByRole("banner").getByRole("link", { name: "Fale no WhatsApp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Menu" })).toBeHidden();
  });
});

test.describe("rodapé", () => {
  test("mostra horário, cidades e a linha de projeto conceito com o portfólio", async ({ page }) => {
    await page.goto("/");
    const rodape = page.getByRole("contentinfo");
    await expect(rodape).toContainText("Segunda a sexta, 7h às 17h");
    await expect(rodape).toContainText("Várzea Grande");
    await expect(rodape).toContainText("Projeto conceito de Gustavo Walien");
    await expect(rodape.getByRole("link", { name: "Ver portfólio" })).toHaveAttribute(
      "href",
      "https://github.com/GustavoWalien",
    );
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npm run test:e2e -- tests/e2e/whatsapp.spec.ts`
Esperado: FALHA, porque ainda não existe `#whatsapp-flutuante` nem rodapé.

- [ ] **Passo 3: Criar o aviso**

Crie `components/layout/AvisoConceito.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { TextosConceito } from "@/content/tipos";

type Props = { textos: TextosConceito["aviso"]; hrefAutor: string };

/** Janela "Este é um projeto conceito". Intercepta o clique em qualquer link com data-aviso. */
export function AvisoConceito({ textos, hrefAutor }: Props) {
  const janela = useRef<HTMLDialogElement>(null);
  const principal = useRef<HTMLAnchorElement>(null);
  const origem = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialogo = janela.current;
    if (!dialogo) return;
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-aviso]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      origem.current = link;
      dialogo.showModal();
      principal.current?.focus();
    };
    const aoFechar = () => origem.current?.focus();
    const aoClicarNoFundo = (e: MouseEvent) => {
      if (e.target === dialogo) dialogo.close();
    };
    document.addEventListener("click", aoClicar);
    dialogo.addEventListener("close", aoFechar);
    dialogo.addEventListener("click", aoClicarNoFundo);
    return () => {
      document.removeEventListener("click", aoClicar);
      dialogo.removeEventListener("close", aoFechar);
      dialogo.removeEventListener("click", aoClicarNoFundo);
    };
  }, []);

  return (
    <dialog ref={janela} className="aviso" aria-labelledby="aviso-titulo" aria-describedby="aviso-texto">
      <div className="aviso__topo">
        <span className="aviso__selo">{textos.selo}</span>
        <form method="dialog">
          <button className="aviso__fechar" aria-label={textos.fecharRotulo}>
            ×
          </button>
        </form>
      </div>
      <div className="aviso__corpo">
        <h2 id="aviso-titulo">{textos.titulo}</h2>
        <p id="aviso-texto">{textos.texto}</p>
        <div className="aviso__acoes">
          <a
            ref={principal}
            className="botao botao--ipe"
            href={hrefAutor}
            target="_blank"
            rel="noopener"
            onClick={() => janela.current?.close()}
          >
            {textos.botaoAutor}
          </a>
          <form method="dialog">
            <button className="aviso__secundario">{textos.botaoFechar}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
```

Crie `components/layout/aviso-conceito.css`:

```css
@layer components {
  .aviso {
    margin: auto;
    max-width: min(460px, calc(100% - 32px));
    padding: 0;
    border: 2.5px solid var(--color-profundo);
    border-radius: 22px;
    box-shadow: 0 8px 0 var(--color-profundo);
    background: var(--color-papel);
    color: var(--color-profundo);
  }
  .aviso::backdrop {
    background: rgb(7 26 51 / 0.55);
  }
  .aviso[open] {
    animation: aviso-surgir 0.35s var(--ease-saida);
  }
  .aviso__topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 0 22px;
  }
  .aviso__selo {
    font: 500 0.72rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: var(--color-ipe);
    border: 2px solid var(--color-profundo);
    border-radius: 999px;
    padding: 6px 10px;
  }
  .aviso__fechar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 2px solid var(--color-profundo);
    background: #fff;
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
  }
  .aviso__corpo {
    padding: 14px 22px 24px;
  }
  .aviso__corpo h2 {
    font-weight: 800;
    font-size: 1.7rem;
    line-height: 1.1;
  }
  .aviso__corpo p {
    margin-top: 10px;
    color: var(--color-tinta-suave);
  }
  .aviso__acoes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    margin-top: 20px;
  }
  .aviso__secundario {
    min-height: 44px;
    padding: 10px 4px;
    border: 0;
    background: none;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;
  }
}

@keyframes aviso-surgir {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
```

- [ ] **Passo 4: Criar o botão flutuante**

Crie `components/layout/WhatsappFlutuante.tsx`:

```tsx
import { IconeWhatsapp } from "@/components/marca/IconeWhatsapp";
import { LinkWhatsapp } from "./LinkWhatsapp";

/** Botão redondo de WhatsApp, fixo no canto. O Plano 2 o esconde enquanto o hero ocupa a tela. */
export function WhatsappFlutuante() {
  return (
    <LinkWhatsapp id="whatsapp-flutuante" className="flutuante" rotulo="Fale no WhatsApp">
      <IconeWhatsapp />
    </LinkWhatsapp>
  );
}
```

Crie `components/layout/whatsapp-flutuante.css`:

```css
@layer components {
  .flutuante {
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 15;
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--color-ipe);
    color: var(--color-profundo);
    border: 2.5px solid var(--color-profundo);
    box-shadow: var(--shadow-dura);
    transition:
      transform 0.3s var(--ease-saida),
      opacity 0.3s var(--ease-saida);
  }
  .flutuante:hover {
    transform: translateY(-3px) rotate(-6deg);
  }
  .flutuante svg {
    width: 30px;
    height: 30px;
  }
  @media (max-width: 860px) {
    .flutuante {
      right: 14px;
      bottom: 14px;
      width: 56px;
      height: 56px;
    }
  }
}
```

- [ ] **Passo 5: Criar o rodapé**

Crie `components/layout/Rodape.tsx`:

```tsx
import Link from "next/link";
import { Flor } from "@/components/marca/Flor";
import { conceito } from "@/content/conceito";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { linhaConceito } from "@/lib/conceito";

/** Rodapé azul-profundo: marca, páginas, horário, cidades e, no modo conceito, o aviso de projeto conceito. */
export function Rodape() {
  const aviso = linhaConceito(config, conceito);
  const paginas = [{ rotulo: "Início", href: "/" }, ...menu];
  return (
    <footer className="rodape escuro">
      <div className="rodape__grade">
        <div>
          <p className="rodape__marca">
            <Flor className="rodape__flor" />
            {empresa.nome}
          </p>
          <p className="rodape__frase">{empresa.frase}</p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="rodape__titulo">Páginas</h2>
          <ul>
            {paginas.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{p.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="rodape__titulo">Atendimento</h2>
          <ul>
            {empresa.horario.map((h) => (
              <li key={h.dias}>
                {h.dias}, {h.horas}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="rodape__titulo">Onde atendemos</h2>
          <p>{empresa.cidades.join(", ")}.</p>
        </div>
      </div>
      <div className="rodape__base">
        <span>
          © {empresa.nome} · {empresa.cidade}-{empresa.estado}
        </span>
        {aviso && (
          <span>
            {aviso.texto} <a href={aviso.href}>Ver portfólio</a>
          </span>
        )}
      </div>
    </footer>
  );
}
```

Crie `components/layout/rodape.css`:

```css
@layer components {
  .rodape {
    background: var(--color-profundo);
    color: var(--color-ceu-claro);
    padding: 56px max(16px, calc((100vw - 1120px) / 2)) 28px;
  }
  .rodape__grade {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.3fr;
    gap: 32px;
  }
  .rodape__marca {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-papel);
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.4rem;
  }
  .rodape__flor {
    width: 28px;
    height: 28px;
  }
  .rodape__frase {
    margin-top: 8px;
  }
  .rodape__titulo {
    margin-bottom: 12px;
    font: 500 0.74rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-ipe);
  }
  .rodape ul {
    display: grid;
    gap: 8px;
    padding: 0;
    list-style: none;
  }
  .rodape a {
    color: var(--color-papel);
    text-underline-offset: 4px;
  }
  .rodape__base {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1.5px solid rgb(214 238 251 / 0.25);
    font-size: 0.92rem;
  }
  @media (max-width: 860px) {
    .rodape__grade {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 520px) {
    .rodape__grade {
      grid-template-columns: 1fr;
    }
    .rodape {
      padding-bottom: 96px;
    }
  }
}
```

No celular, o `padding-bottom: 96px` deixa espaço para o botão flutuante não cobrir o fim do rodapé.

- [ ] **Passo 6: Ligar tudo no layout e os CSS no `globals.css`**

Em `app/globals.css`, logo abaixo do import da barra:

```css
@import "../components/layout/aviso-conceito.css";
@import "../components/layout/whatsapp-flutuante.css";
@import "../components/layout/rodape.css";
```

Em `app/layout.tsx`, acrescente os imports:

```tsx
import { AvisoConceito } from "@/components/layout/AvisoConceito";
import { Rodape } from "@/components/layout/Rodape";
import { WhatsappFlutuante } from "@/components/layout/WhatsappFlutuante";
import { conceito } from "@/content/conceito";
import { config } from "@/content/config";
import { destinoWhatsapp } from "@/lib/contato";
```

E troque o `<body>` inteiro por:

```tsx
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <BarraTopo />
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Rodape />
        <WhatsappFlutuante />
        {config.modoConceito && (
          <AvisoConceito textos={conceito.aviso} hrefAutor={destinoWhatsapp(config, empresa).href} />
        )}
      </body>
```

- [ ] **Passo 7: Rodar e ver passar**

Rode: `npm run test:e2e`
Esperado: PASSA em todos os testes de ponta a ponta (`base`, `barra` e `whatsapp`) nos dois projetos.

- [ ] **Passo 8: Commit**

```bash
git add components/layout/AvisoConceito.tsx components/layout/aviso-conceito.css components/layout/WhatsappFlutuante.tsx components/layout/whatsapp-flutuante.css components/layout/Rodape.tsx components/layout/rodape.css app/globals.css app/layout.tsx tests/e2e/whatsapp.spec.ts
git commit -m "feat: aviso de projeto conceito, WhatsApp flutuante e rodapé

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 7: Verificação final e entrega para revisão

**Arquivos:**
- Modificar: `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, no registro de progresso.

**Interfaces:**
- Consome: tudo das Tarefas 1 a 6.
- Produz: a branch `feat/fundacao` verde e pronta para o Plano 2.

- [ ] **Passo 1: Lint e tipos**

Rode: `npm run lint && npm run typecheck`
Esperado: nenhum erro. Se o lint apontar algo, corrija no arquivo apontado e rode de novo.

- [ ] **Passo 2: Todos os testes**

Rode: `npm run test:all`
Esperado: todos os testes do Vitest e do Playwright passam nos projetos `desktop` e `mobile`.

- [ ] **Passo 3: Build sem renderização por visita**

Rode: `npm run build`
Esperado: o build termina sem erro. A tabela de rotas mostra `/` como estática. O `ensureStatic = "navigation"` faria o build falhar se alguma página dependesse da visita.

- [ ] **Passo 4: Conferir com os próprios olhos**

Rode `npm run dev` e abra http://localhost:3000 no computador e com a janela estreita (375 px). Confira:
- a placa balança ao carregar;
- o menu do celular abre e fecha;
- o botão flutuante abre o aviso;
- o rodapé está completo.

Mande o link ao usuário no próprio chat, numa linha só, e faça a pergunta de aprovação no fim da mensagem, sem janela de pergunta.

- [ ] **Passo 5: Registrar no plano de projetos do portfólio**

Em `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, acrescente ao fim da tabela "Registro de progresso" uma linha com a data de hoje (DD/MM/AAAA):

```markdown
| DD/MM/AAAA | Site de negócio local | Plano 1 (fundação) executado: testes, cores, fontes, conteúdo tipado, barra placa de loja, menu do celular, rodapé, WhatsApp flutuante e aviso de projeto conceito. |
```

Esse arquivo é de outro repositório. Não faça commit nele sem pedido do usuário.

