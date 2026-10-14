# Plano 2 (Início): plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar o progresso.

**Objetivo:** trocar a Início provisória pela página de verdade, com estas partes:
- o hero cartoon guiado pelo scroll (port do protótipo v4);
- as seções "O que a gente faz", "Como funciona", "O que a gente promete", "Depoimentos" e "Perguntas frequentes";
- o simulador de economia;
- a chamada final com o formulário de pedido.

**Arquitetura:**
- **Hero:**
  - o componente de servidor `Hero` manda todo o SVG e todo o texto prontos no HTML;
  - os números (placas, raios, estrelas, pétalas, caminho do sol, relógio) vêm de funções puras em `components/hero/geometria.ts`, testadas no Vitest;
  - um único componente cliente, `MotorDoHero`, liga o scroll a um loop `requestAnimationFrame` que só escreve no DOM quando o valor muda;
  - o mesmo motor liga os estados da barra do topo e o botão flutuante na Início.
- **Seções:** são de servidor, com o conteúdo em `content/`. Só o `Simulador`, o `Revelar` (entrada ao aparecer) e o `FormularioPedido` rodam no navegador. Tudo funciona sem JavaScript.
- **Formulário:**
  - ação do servidor `enviarPedido` (`app/actions/pedido.ts`);
  - validação pura em `lib/pedido.ts`;
  - e-mail montado em `lib/email.ts` por um transporte trocável.

  O transporte de teste (`EMAIL_TRANSPORTE=teste`) não sai para a rede. O Resend entra no Plano 5, junto com a integração da Vercel.
- **Estilo:** um `.css` por componente, com classes prefixadas (`hero__`, `simulador__`, `como__`…), importado no `globals.css`. É o mesmo esquema do Plano 1.

**Stack:** Next.js 16.4, React 19.3 (`useActionState`), TypeScript, Tailwind CSS 4 pelo PostCSS, Vitest 5.0.3, Playwright 1.64.0.

**Spec:** [docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md](../specs/2026-10-13-site-ipe-solar-design.md). Este plano cobre:
- a seção 3 (estados da barra na Início e o botão flutuante escondido durante o hero);
- as seções 4, 6, 7 e 8, menos o envio real pelo Resend;
- a parte da Início das seções 13 e 14.

Textos em [docs/textos.md](../../textos.md). Referência visual e de comportamento do hero: `prototipos/hero/v4-barra-placa.html`, que é local e fica fora do Git.

## Roteiro dos planos

| Plano | O quê | Situação |
|---|---|---|
| 1. Fundação | Testes, cores, fontes, conteúdo, barra placa, rodapé, WhatsApp e aviso | feito, na `main` |
| **2. Início (este)** | Hero, seções, simulador, perguntas, formulário com transporte de e-mail | |
| 3. Páginas | Serviços (lista e 4 páginas), Sobre com equipe ilustrada, Contato com mapa e formulário, 404 | |
| 4. Blog | MDX, 3 artigos completos, capas, imagens de compartilhamento por artigo | |
| 5. Google e publicação | Dados estruturados, sitemap, robots, imagem da Início, Lighthouse, Vercel, **Resend**, README, `CONTEUDO.md`, portfólio | |

## Restrições globais

- **Do Plano 1, valem todas:**
  - ler o guia em `node_modules/next/dist/docs/` antes de usar uma API do Next;
  - `ensureStatic = "navigation"` no layout raiz, com nenhuma página renderizando por visita;
  - só português do Brasil;
  - a paleta exata do `@theme static`;
  - as três fontes por `next/font/google`;
  - contorno de 2,5 px `profundo`, sombra dura `0 5px 0 profundo` e raio de 16 a 22 px;
  - foco `profundo` no fundo claro e `ipe` no escuro;
  - contraste de 4,5:1;
  - alvos de toque de 44 px no celular;
  - um H1 por página;
  - os testes rodam com `npm test`, `npm run test:e2e` e `npm run test:all`.
- **Git:** o trabalho acontece na branch `feat/inicio`, criada a partir da `main`. Cada tarefa termina em pelo menos um commit, e toda mensagem termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. O usuário autorizou o envio ao GitHub.
- **Texto:**
  - todo texto visível vem de `docs/textos.md` e mora em `content/`;
  - o portão de texto (`tests/unit/texto.test.ts`) confere todo arquivo de `content/`: nenhum travessão (—) e nenhuma palavra de estoque.
- **Animação:**
  - só `transform` e `opacity` animam;
  - **nada de `filter` CSS animado**.

  Há duas exceções herdadas do protótipo aprovado:
  - o marca-texto amarelo dos títulos do hero, com `background-size` guiado por `--k`, como a spec (seção 5) manda;
  - três traços pequenos do cenário (cachoeira, fio de energia e vento do ar-condicionado), com `stroke-dashoffset` em loop.
- **Hero, regras de desempenho (spec, seção 6):**
  - por quadro, só mudam `transform`, `opacity` e atributos de elementos pequenos;
  - camadas grandes com `will-change: transform`;
  - os textos do painel mudam no máximo 10 vezes por segundo;
  - nenhum estado React muda por quadro.
- **Componentes de cliente:**
  - continuam os do Plano 1: `MenuCelular` e `AvisoConceito`;
  - este plano acrescenta só `MotorDoHero`, `Simulador`, `Revelar` e `FormularioPedido`;
  - `BarraTopo` e `WhatsappFlutuante` continuam de servidor, decisão do Plano 1. Os estados deles na Início vêm de classes que o `MotorDoHero` liga e desliga.
- **Sem JavaScript, a Início funciona inteira:**
  - o hero mostra o meio-dia numa tela;
  - o simulador mostra a estimativa de R$ 450;
  - os passos aparecem;
  - o formulário envia por POST nativo.
- **E-mail:** nenhum dado pessoal vai para o log. Com `EMAIL_TRANSPORTE=teste`, nada sai para a rede. Sem essa variável, até o Plano 5, o envio falha com uma mensagem de log sem dados do pedido.

## Foco da revisão

1. **Visitante sem JavaScript na Início:**
   - o hero mostra o meio-dia numa tela, com os botões finais (Tarefa 6);
   - o simulador mostra a estimativa de R$ 450 (Tarefa 4);
   - os passos de "Como funciona" aparecem sem esperar (Tarefa 8);
   - o formulário envia por POST nativo e mostra o sucesso (Tarefa 11).
2. **Celular em pé e deitado:**
   - em pé, a câmera usa o enquadramento `780 300 750 600`;
   - deitado, usa a cena inteira ancorada à direita;
   - nos dois casos, a casa continua dentro da tela.

   Teste na Tarefa 7.
3. **Movimento reduzido ligado ou desligado no meio da visita:** o hero troca na hora entre a cena parada do meio-dia, numa tela, e a animação pelo scroll. Teste na Tarefa 7.
4. **Pessoa que corrige um erro e reenvia logo em seguida:** o pedido não pode ser descartado como robô. O carimbo de tempo guarda a hora em que o formulário apareceu, e não a do último envio (Tarefa 11). Um robô de verdade (campo armadilha ou envio em menos de 3 s) recebe um sucesso falso, sem envio (Tarefa 10).
5. **Sair da Início e voltar sem recarregar (navegação do Next):**
   - nas outras páginas, a barra fica sólida e o botão flutuante aparece;
   - de volta à Início, o hero recomeça da madrugada.

   Teste na Tarefa 7.

## Estrutura de arquivos

```
app/globals.css                          imports na ordem certa: botão e seção antes dos componentes (modificar)
app/page.tsx                             Início: hero e seções (reescrever)
app/servicos/[slug]/page.tsx             página provisória de cada serviço, até o Plano 3 (criar)
app/actions/pedido.ts                    ação do servidor do formulário (criar)
components/ui/botao.css                  .pular e .botao, saídos do globals.css (criar)
components/ui/Secao.tsx · Rotulo.tsx     seção com rótulo e H2 (+ secao.css)
components/ui/Revelar.tsx                entrada ao aparecer, cliente (+ revelar.css)
components/marca/Flor.tsx                contorno e miolo em currentColor (modificar)
components/layout/*.css                  acertos herdados e estados da barra e do flutuante na Início (modificar)
components/hero/geometria.ts             números do hero, funções puras
components/hero/Hero.tsx · Faixa.tsx     hero no servidor (+ hero.css)
components/hero/MotorDoHero.tsx          loop do scroll, cliente
components/hero/camadas/*.tsx            Camada, Ceu, Arco, Sol, Nuvens, Ave (tuiuiú), Longe (Chapada), Meio, Perto, Ipe, Casa, Frente, formas
components/inicio/Simulador.tsx          simulador, cliente (+ simulador.css)
components/inicio/SecaoSimulador.tsx     seção da Início que envolve o simulador
components/inicio/OQueFazemos.tsx · IconeServico.tsx      (+ fazemos.css)
components/inicio/ComoFunciona.tsx       (+ como.css)
components/inicio/Promessas.tsx · IconePromessa.tsx       (+ promessas.css)
components/inicio/Depoimentos.tsx        (+ depoimentos.css)
components/inicio/Perguntas.tsx          (+ perguntas.css)
components/inicio/ChamadaFinal.tsx       (+ chamada.css)
components/contato/FormularioPedido.tsx  formulário, cliente (+ pedido.css); o Plano 3 o reusa na Contato
content/tipos.ts                         tipos novos (modificar)
content/inicio.ts · servicos.ts · perguntas.ts · depoimentos.ts · simulador.ts · formulario.ts
content/empresa.ts                       horário "das 7h", remetente (modificar)
lib/simulador.ts · lib/texto.ts · lib/pedido.ts · lib/email.ts
tests/unit/conteudo-inicio.test.ts · simulador.test.ts · hero-geometria.test.ts · pedido.test.ts · email.test.ts · acao-pedido.test.ts
tests/unit/modo-desligado.test.tsx       simulador no modo desligado (modificar)
tests/e2e/hero.spec.ts · simulador.spec.ts · secoes.spec.ts · formulario.spec.ts
tests/e2e/barra.spec.ts · whatsapp.spec.ts · base.spec.ts · geometria.spec.ts   ajustes (modificar)
```

---

### Tarefa 1: Acertos herdados do Plano 1

Corrige seis dos nove menores adiados na revisão do Plano 1. O primeiro é pré-requisito deste plano: o CSS dos componentes entrava antes do `.botao`, e qualquer ajuste de botão nas seções novas seria anulado.

Os outros três menores ficam adiados:
- o teste da placa no celular;
- o foco nas bordas do menu;
- o clique fora no iPhone.

**Arquivos:**
- Criar: `components/ui/botao.css`
- Modificar: `app/globals.css`, `components/layout/barra-topo.css`, `components/marca/Flor.tsx`, `components/layout/rodape.css`, `components/layout/aviso-conceito.css`, `content/empresa.ts`
- Teste: `tests/e2e/barra.spec.ts`, `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consome: o Plano 1 inteiro.
- Produz:
  - `components/ui/botao.css`, importado antes de todo CSS de componente;
  - `Flor` com contorno e miolo em `currentColor`.

- [ ] **Passo 1: Criar a branch**

Rode: `git switch main && git pull && git switch -c feat/inicio`
Esperado: `Switched to a new branch 'feat/inicio'`.

- [ ] **Passo 2: Escrever os testes que falham**

Em `tests/e2e/barra.spec.ts`, dentro do `test.describe("barra do topo", …)`, acrescente depois do teste "no computador: links e chamada para o WhatsApp do autor":

```ts
  test("a chamada do topo usa o próprio espaçamento, não o do .botao", async ({ page, isMobile }) => {
    test.skip(isMobile, "só no computador");
    await page.goto("/sobre");
    const chamada = page.getByRole("banner").getByRole("link", { name: "Peça seu orçamento" });
    expect(await chamada.evaluate((el) => getComputedStyle(el).padding)).toBe("11px 18px");
  });

  test("a placa não repete o balanço de carregamento quando o mouse sai", async ({ page, isMobile }) => {
    test.skip(isMobile, "só no computador");
    await page.goto("/sobre");
    const placa = page.locator(".topo__placa");
    const rodando = () =>
      placa.evaluate((el) => el.getAnimations().filter((a) => a.playState === "running").length);
    await expect.poll(rodando).toBe(0);
    await placa.hover();
    await page.waitForTimeout(1100);
    await page.mouse.move(700, 500);
    await page.waitForTimeout(150);
    expect(await rodando()).toBe(0);
  });
```

Em `tests/e2e/whatsapp.spec.ts`, troque o `test.describe("rodapé", …)` inteiro por:

```ts
test.describe("rodapé", () => {
  test("mostra horário, cidades e a linha de projeto conceito com o portfólio", async ({ page }) => {
    await page.goto("/");
    const rodape = page.getByRole("contentinfo");
    await expect(rodape).toContainText("Segunda a sexta, das 7h às 17h");
    await expect(rodape).toContainText("Várzea Grande");
    await expect(rodape).toContainText("Projeto conceito de Gustavo Walien");
    await expect(rodape.getByRole("link", { name: "Ver portfólio" })).toHaveAttribute(
      "href",
      "https://github.com/GustavoWalien",
    );
  });

  test("a flor do rodapé tem contorno e miolo visíveis no azul", async ({ page }) => {
    await page.goto("/sobre");
    const miolo = page.locator(".rodape__flor circle");
    expect(await miolo.evaluate((el) => getComputedStyle(el).fill)).toBe("rgb(245, 184, 0)");
  });

  test("no celular, os links do rodapé têm 44 px de altura", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/sobre");
    const alturas = await page
      .getByRole("contentinfo")
      .getByRole("link")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    expect(alturas.length).toBeGreaterThan(0);
    for (const altura of alturas) expect(altura).toBeGreaterThanOrEqual(44);
  });
});

test("o botão de fechar do aviso usa o papel, não o branco puro", async ({ page }) => {
  await page.goto("/sobre");
  await page.locator("#whatsapp-flutuante").click();
  const fechar = page.getByRole("dialog").getByRole("button", { name: "Fechar aviso" });
  expect(await fechar.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(250, 250, 245)");
});
```

- [ ] **Passo 3: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/barra.spec.ts tests/e2e/whatsapp.spec.ts`
Esperado: FAIL nestes 6 testes:

| Teste | Recebido |
|---|---|
| espaçamento da chamada | `12px 20px` |
| balanço da placa | 1 animação rodando |
| horário | o texto não tem "das" |
| flor | `rgb(14, 53, 87)` |
| links do rodapé | altura de cerca de 20 px |
| botão de fechar | `rgb(255, 255, 255)` |

Os outros passam.

- [ ] **Passo 4: Tirar `.pular` e `.botao` do globals.css**

Crie `components/ui/botao.css`:

```css
/* .pular e .botao entram antes do CSS dos componentes, para os componentes poderem ajustá-los. */
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
```

Em `app/globals.css`:
- troque as 5 primeiras linhas (os `@import`) por:

  ```css
  @import "tailwindcss";
  /* ordem: o que é comum primeiro, os componentes depois, para os componentes poderem ajustar o comum */
  @import "../components/ui/botao.css";
  @import "../components/layout/barra-topo.css";
  @import "../components/layout/aviso-conceito.css";
  @import "../components/layout/whatsapp-flutuante.css";
  @import "../components/layout/rodape.css";
  ```

- apague o bloco `@layer components { … }` inteiro (de `.pular` até o fim de `.botao--ipe:active`), que agora mora em `botao.css`.

Em `components/layout/barra-topo.css`, troque o comentário `/* .topo na frente: precisa vencer o display do .botao, que vem depois no globals.css */` por `/* .topo na frente: some no celular mesmo sendo um .botao */`.

- [ ] **Passo 5: A placa só balança de novo no hover**

Em `components/layout/barra-topo.css`, troque:

```css
  .topo__placa:hover {
    animation: placa-balancar-de-novo 1s var(--ease-saida);
  }
```

por:

```css
  /* a animação de carregamento continua na lista: assim, quando o mouse sai, ela não recomeça */
  .topo__placa:hover {
    animation:
      placa-balancar 1.5s var(--ease-saida) 0.25s both,
      placa-balancar-de-novo 1s var(--ease-saida);
  }
```

- [ ] **Passo 6: A flor herda a cor do lugar onde está**

Troque `components/marca/Flor.tsx` por:

```tsx
/** A flor do ipê, logo da marca. Contorno e miolo seguem a cor do texto (currentColor). Decorativa. */
export function Flor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g fill="#FAFAF5" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="16" cy="7" rx="4" ry="6" />
        <ellipse cx="16" cy="25" rx="4" ry="6" />
        <ellipse cx="7" cy="16" rx="6" ry="4" />
        <ellipse cx="25" cy="16" rx="6" ry="4" />
      </g>
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}
```

Na placa do topo, a cor do texto é `profundo`, então a flor fica igual. Em `components/layout/rodape.css`, troque:

```css
  .rodape__flor {
    width: 28px;
    height: 28px;
  }
```

por:

```css
  /* no azul, contorno e miolo amarelos (a flor usa currentColor) */
  .rodape__flor {
    width: 28px;
    height: 28px;
    color: var(--color-ipe);
  }
```

- [ ] **Passo 7: Links do rodapé com 44 px no celular, papel no aviso e o "das" no horário**

Em `components/layout/rodape.css`, dentro do `@media (max-width: 860px)`, acrescente depois de `.rodape__grade { … }`:

```css
    .rodape ul {
      gap: 0;
    }
    .rodape a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
    }
```

Em `components/layout/aviso-conceito.css`, no `.aviso__fechar`, troque `background: #fff;` por `background: var(--color-papel);`.

Em `content/empresa.ts`, troque o `horario` por:

```ts
  horario: [
    { dias: "Segunda a sexta", horas: "das 7h às 17h" },
    { dias: "Sábado", horas: "das 7h às 11h" },
  ],
```

- [ ] **Passo 8: Rodar e ver passar**

Rode: `npm test && npx playwright test tests/e2e/barra.spec.ts tests/e2e/whatsapp.spec.ts`
Esperado: PASS em todos, nos projetos `desktop` e `mobile`.

- [ ] **Passo 9: Commit**

```bash
git add app/globals.css components/ui/botao.css components/layout components/marca/Flor.tsx content/empresa.ts tests/e2e/barra.spec.ts tests/e2e/whatsapp.spec.ts
git commit -m "fix: acertos herdados do Plano 1 (cascata do botão, placa, flor, rodapé, aviso e horário)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: Conteúdo da Início

**Arquivos:**
- Modificar: `content/tipos.ts`
- Criar: `content/inicio.ts`, `content/servicos.ts`, `content/perguntas.ts`, `content/depoimentos.ts`, `content/simulador.ts`, `content/formulario.ts`
- Teste: `tests/unit/conteudo-inicio.test.ts`

**Interfaces:**
- Consome: os tipos do Plano 1 em `content/tipos.ts`.
- Produz:
  - tipos `Trecho`, `FaixaHero`, `TextosHero`, `Passo`, `IconePromessa`, `Promessa`, `TextosInicio`, `IconeServico`, `Servico`, `Pergunta`, `Depoimento`, `ConstantesSimulador`, `CampoPedido` e `TextosFormulario`;
  - os objetos `inicio: TextosInicio`, `servicos: Servico[]`, `perguntas: Pergunta[]`, `depoimentos: Depoimento[]`, `constantesSimulador: ConstantesSimulador` e `formulario: TextosFormulario`.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/unit/conteudo-inicio.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { depoimentos } from "@/content/depoimentos";
import { formulario } from "@/content/formulario";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";
import { servicos } from "@/content/servicos";
import { constantesSimulador as c } from "@/content/simulador";

describe("conteúdo da Início", () => {
  it("o hero tem três faixas, e cada título tem um trecho em destaque", () => {
    expect(inicio.hero.faixas).toHaveLength(3);
    for (const faixa of inicio.hero.faixas) {
      expect(faixa.titulo.filter((t) => t.destaque)).toHaveLength(1);
    }
    expect(inicio.hero.faixas[0].rotulo).toBe("Energia solar em Cuiabá");
  });

  it("os quatro serviços têm os endereços da spec e ícones diferentes", () => {
    expect(servicos.map((s) => s.slug)).toEqual([
      "energia-solar-residencial",
      "energia-solar-para-empresas",
      "energia-solar-rural",
      "limpeza-de-placas-solares",
    ]);
    expect(new Set(servicos.map((s) => s.icone)).size).toBe(4);
  });

  it("quatro passos, quatro promessas com ícones diferentes, três depoimentos e oito perguntas", () => {
    expect(inicio.comoFunciona.passos).toHaveLength(4);
    expect(inicio.promessas.itens).toHaveLength(4);
    expect(new Set(inicio.promessas.itens.map((p) => p.icone)).size).toBe(4);
    expect(depoimentos).toHaveLength(3);
    expect(perguntas).toHaveLength(8);
    expect(new Set(perguntas.map((p) => p.pergunta)).size).toBe(8);
  });

  it("o deslizador começa dentro da faixa e num múltiplo do passo", () => {
    expect(c.minimo).toBe(150);
    expect(c.maximo).toBe(3000);
    expect(c.inicial).toBeGreaterThanOrEqual(c.minimo);
    expect(c.inicial).toBeLessThanOrEqual(c.maximo);
    expect((c.inicial - c.minimo) % c.passo).toBe(0);
  });

  it("a explicação do simulador cita os números que a conta usa", () => {
    const texto = inicio.simulador.comoTexto.join(" ");
    const br = (n: number, casas = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas });
    for (const trecho of [
      `R$ ${br(c.tarifa, 2)}`,
      `${c.taxaMinimaKwh} kWh`,
      `${c.potenciaPlacaW} W`,
      `${br(c.geracaoKwhPorKwpDia)} kWh por kWp`,
      `${Math.round(c.perdaFioB * 100)}%`,
      `${Math.round(c.margem * 100)}%`,
    ]) {
      expect(texto).toContain(trecho);
    }
  });

  it("os modelos de mensagem têm onde pôr o valor e o nome", () => {
    expect(inicio.simulador.mensagem).toContain("{valor}");
    expect(formulario.sucesso).toContain("{nome}");
    expect(formulario.sucessoConceito).toContain("{nome}");
  });

  it("o formulário tem as opções da spec", () => {
    expect(formulario.opcoesConta).toEqual(["Até R$ 300", "R$ 300 a R$ 600", "R$ 600 a R$ 1.000", "Mais de R$ 1.000"]);
    expect(formulario.opcoesOnde).toEqual(["Casa", "Empresa", "Fazenda ou sítio"]);
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/conteudo-inicio.test.ts`
Esperado: FAIL com "Failed to resolve import "@/content/depoimentos"".

- [ ] **Passo 3: Acrescentar os tipos**

No fim de `content/tipos.ts`, acrescente:

```ts
/** Pedaço de um título. `destaque` ganha o realce amarelo. */
export type Trecho = { texto: string; destaque?: boolean };

export type FaixaHero = { rotulo: string; titulo: Trecho[]; apoio: string };

export type TextosHero = {
  /** Madrugada, manhã e meio-dia, nesta ordem. O rótulo da primeira faixa faz parte do H1. */
  faixas: [FaixaHero, FaixaHero, FaixaHero];
  botaoOrcamento: string;
  botaoSimular: string;
  dica: string;
  painel: { lugar: string; gerando: string };
};

export type Passo = { titulo: string; texto: string };

export type IconePromessa = "atendimento" | "telhado" | "proposta" | "protocolo";

export type Promessa = { titulo: string; texto: string; icone: IconePromessa };

export type TextosInicio = {
  hero: TextosHero;
  oQueFazemos: { rotulo: string; titulo: string };
  simulador: {
    rotulo: string;
    titulo: string;
    controle: string;
    sistema: string;
    economia: string;
    ano: string;
    porMes: string;
    aviso: string;
    comoTitulo: string;
    comoTexto: string[];
    botao: string;
    /** "{valor}" vira o valor escolhido, ex.: "1.200". */
    mensagem: string;
  };
  comoFunciona: { titulo: string; passos: Passo[] };
  promessas: { titulo: string; itens: Promessa[] };
  depoimentos: { titulo: string; nota: string };
  perguntas: { titulo: string };
  chamadaFinal: { titulo: string; apoio: string; botao: string; formulario: string };
};

export type IconeServico = "casa" | "empresa" | "campo" | "limpeza";

export type Servico = {
  slug: string;
  /** Nome do serviço, usado no link do cartão. Ex.: "Energia solar para casa". */
  nome: string;
  icone: IconeServico;
  cartao: { titulo: string; texto: string };
};

export type Pergunta = { pergunta: string; resposta: string };

export type Depoimento = { texto: string; nome: string; lugar: string; tipo: string };

export type ConstantesSimulador = {
  /** R$ por kWh, com impostos. */
  tarifa: number;
  taxaMinimaKwh: number;
  geracaoKwhPorKwpDia: number;
  potenciaPlacaW: number;
  /** De 0 a 1. */
  perdaFioB: number;
  /** De 0 a 1: a faixa vai de (1 − margem) a (1 + margem). */
  margem: number;
  minimo: number;
  maximo: number;
  passo: number;
  inicial: number;
};

export type CampoPedido = "nome" | "whatsapp" | "cidade" | "conta" | "onde" | "mensagem";

export type TextosFormulario = {
  campos: Record<CampoPedido, string>;
  opcional: string;
  escolha: string;
  opcoesConta: string[];
  opcoesOnde: string[];
  botao: string;
  enviando: string;
  privacidade: string;
  /** Linha acima do botão, só no modo conceito. */
  aviso: string;
  erros: {
    nome: string;
    nomeLongo: string;
    whatsapp: string;
    cidade: string;
    conta: string;
    onde: string;
    mensagem: string;
    envio: string;
  };
  /** "{nome}" vira o nome de quem pediu. */
  sucesso: string;
  sucessoConceito: string;
};
```

- [ ] **Passo 4: Escrever o conteúdo**

Crie `content/inicio.ts`:

```ts
import type { TextosInicio } from "./tipos";

export const inicio: TextosInicio = {
  hero: {
    faixas: [
      {
        rotulo: "Energia solar em Cuiabá",
        titulo: [{ texto: "Em Cuiabá, o sol " }, { texto: "chega cedo", destaque: true }, { texto: "." }],
        apoio: "E fica o dia inteiro. Ele pode pagar a sua conta de luz.",
      },
      {
        rotulo: "Placas ligadas",
        titulo: [{ texto: "Seu telhado vira uma " }, { texto: "usina", destaque: true }, { texto: "." }],
        apoio: "Cada placa transforma luz em energia. O ar-condicionado liga e quem paga a conta é o sol.",
      },
      {
        rotulo: "Conta mais leve",
        titulo: [{ texto: "Energia do sol, direto na " }, { texto: "sua conta", destaque: true }, { texto: "." }],
        apoio: "A gente faz o projeto, instala e cuida da liberação com a Energisa. Você só acompanha a conta baixar.",
      },
    ],
    botaoOrcamento: "Peça seu orçamento",
    botaoSimular: "Simule sua economia",
    dica: "Role para o sol nascer",
    painel: { lugar: "Cuiabá", gerando: "Gerando" },
  },
  oQueFazemos: { rotulo: "O que a gente faz", titulo: "Do telhado da casa ao pivô da fazenda." },
  simulador: {
    rotulo: "Simule em 10 segundos",
    titulo: "Quanto você paga de luz por mês?",
    controle: "Valor médio da sua conta de luz",
    sistema: "Sistema sugerido",
    economia: "Economia estimada",
    ano: "Em um ano",
    porMes: "por mês",
    aviso:
      "Estimativa simples para começar a conversa. O valor real depende do telhado, das sombras e do seu consumo ao longo do ano.",
    comoTitulo: "Como essa conta é feita",
    comoTexto: [
      "Dividimos a conta pela tarifa da Energisa MT com impostos, de R$ 1,15 por kWh, para achar o consumo do mês.",
      "Tiramos a taxa mínima de 50 kWh, que a Energisa cobra mesmo de quem gera a própria energia.",
      "Calculamos quantas placas de 585 W geram o resto, contando 4,3 kWh por kWp por dia, uma média conservadora para Cuiabá.",
      "A economia desconta 15% pelo Fio B de 2026 e aparece numa faixa de 7% para mais ou para menos.",
    ],
    botao: "Quero a simulação completa",
    mensagem: "Olá! Minha conta de luz fica em torno de R$ {valor}. Quero uma simulação.",
  },
  comoFunciona: {
    titulo: "Do primeiro oi à conta mais leve.",
    passos: [
      {
        titulo: "Mande sua conta de luz.",
        texto: "Uma foto da última conta já basta. Com ela a gente vê seu consumo e o tipo de ligação.",
      },
      {
        titulo: "Visita técnica.",
        texto: "Olhamos o telhado, as sombras e o padrão de entrada. Fotografamos tudo antes de mexer.",
      },
      {
        titulo: "Instalação.",
        texto: "Numa casa, a obra leva de 1 a 3 dias, e a equipe deixa o telhado como encontrou.",
      },
      {
        titulo: "Liberação e economia.",
        texto:
          "Pedimos a liberação na Energisa e mandamos o número do protocolo para você acompanhar. Quando o medidor novo chega, a economia começa.",
      },
    ],
  },
  promessas: {
    titulo: "O que a gente promete, por escrito.",
    itens: [
      {
        titulo: "Gente de verdade no atendimento.",
        texto:
          "Você fala com quem desenhou o seu projeto, no WhatsApp ou no telefone. Nada de resposta automática.",
        icone: "atendimento",
      },
      {
        titulo: "Telhado protegido.",
        texto:
          "Fotografamos o telhado antes e depois. Se uma telha quebrar na instalação, a troca é por nossa conta.",
        icone: "telhado",
      },
      {
        titulo: "Proposta sem letra miúda.",
        texto: "Marca e modelo de cada equipamento, prazo, garantia e forma de pagamento, tudo no papel.",
        icone: "proposta",
      },
      {
        titulo: "Liberação com protocolo.",
        texto:
          "Você recebe o número do pedido na Energisa e um aviso a cada etapa, sem precisar ficar ligando para saber.",
        icone: "protocolo",
      },
    ],
  },
  depoimentos: {
    titulo: "Quem já liga o ar sem susto.",
    nota: "Depoimentos ilustrativos de um projeto conceito.",
  },
  perguntas: { titulo: "Perguntas frequentes" },
  chamadaFinal: {
    titulo: "Mande uma foto da sua conta de luz.",
    apoio: "A gente responde com uma estimativa de economia, sem compromisso.",
    botao: "Chamar no WhatsApp",
    formulario: "Prefere formulário? A gente liga para você.",
  },
};
```

Crie `content/servicos.ts`:

```ts
import type { Servico } from "./tipos";

/** Os serviços da empresa. A Início mostra os cartões; o Plano 3 acrescenta o conteúdo das páginas. */
export const servicos: Servico[] = [
  {
    slug: "energia-solar-residencial",
    nome: "Energia solar para casa",
    icone: "casa",
    cartao: {
      titulo: "Ar ligado sem medo da conta.",
      texto: "Um sistema do tamanho do seu consumo, com app para ver quanto a casa gera por dia.",
    },
  },
  {
    slug: "energia-solar-para-empresas",
    nome: "Energia solar para empresas",
    icone: "empresa",
    cartao: {
      titulo: "Conta menor, margem maior.",
      texto: "Comércios, clínicas e escritórios gastam energia de dia, justamente quando as placas geram.",
    },
  },
  {
    slug: "energia-solar-rural",
    nome: "Energia solar rural",
    icone: "campo",
    cartao: {
      titulo: "Pivô, bomba e ordenha no sol.",
      texto: "Placas no telhado do galpão ou no chão, com projeto pronto para financiamento rural.",
    },
  },
  {
    slug: "limpeza-de-placas-solares",
    nome: "Limpeza de placas",
    icone: "limpeza",
    cartao: {
      titulo: "Placa suja gera menos.",
      texto: "Na seca, poeira e fuligem das queimadas cobrem as placas. A limpeza devolve a geração.",
    },
  },
];
```

Crie `content/perguntas.ts`:

```ts
import type { Pergunta } from "./tipos";

export const perguntas: Pergunta[] = [
  {
    pergunta: "Energia solar ainda vale a pena com a cobrança do Fio B?",
    resposta:
      "Vale para a maioria das casas e empresas, mas o retorno ficou um pouco mais longo. Quem instala hoje paga uma parte do uso da rede sobre a energia que manda para a Energisa e usa depois. Essa parte se chama Fio B e, em 2026, está em 60%. A energia que você usa na hora em que as placas geram fica de fora dessa cobrança. Por isso a gente desenha o sistema para você aproveitar o máximo durante o dia.",
  },
  {
    pergunta: "Minha conta vai zerar?",
    resposta:
      "Não. Mesmo com energia solar, a Energisa cobra a taxa mínima, a iluminação pública e o Fio B. O que some é a maior parte do valor que você paga hoje pelo consumo.",
  },
  {
    pergunta: "Funciona em dia nublado e na época das chuvas?",
    resposta:
      "Funciona, gerando menos. O sistema é calculado pela média do ano: o que sobra na seca vira crédito e abate a conta dos meses de chuva.",
  },
  {
    pergunta: "A instalação estraga o telhado?",
    resposta:
      "Não deveria, e a gente garante isso por escrito. Fotografamos o telhado antes e depois e usamos suportes próprios para cada tipo de telha. Se uma telha quebrar, a troca é nossa.",
  },
  {
    pergunta: "Quanto tempo até as placas começarem a gerar?",
    resposta:
      "A instalação numa casa leva de 1 a 3 dias. Depois, a Energisa precisa aprovar e trocar o medidor. Esse prazo é dela, e você acompanha tudo pelo número do protocolo.",
  },
  {
    pergunta: "Quanto custa?",
    resposta:
      "Depende do seu consumo e do telhado. Para a maioria das casas, o investimento fica entre R$ 12 mil e R$ 40 mil. Dá para financiar com parcela parecida com a economia na conta. Faça a simulação acima para ter uma ideia.",
  },
  {
    pergunta: "E se der problema depois?",
    resposta:
      "Você tem garantia por escrito: 25 anos de desempenho nas placas, 10 anos ou mais no inversor, conforme a marca, e 5 anos na nossa instalação. O app avisa se o sistema parar de gerar, e a nossa equipe de manutenção atende em Cuiabá e região.",
  },
  {
    pergunta: "Preciso limpar as placas?",
    resposta:
      "Na seca, sim. Entre agosto e setembro, poeira e fuligem das queimadas se acumulam e a geração cai. Uma limpeza nessa época costuma resolver.",
  },
];
```

Crie `content/depoimentos.ts`:

```ts
import type { Depoimento } from "./tipos";

/** Depoimentos ilustrativos: no modo conceito, a nota avisa que são fictícios. */
export const depoimentos: Depoimento[] = [
  {
    texto: "No verão, a conta passava de R$ 900 com os dois ar-condicionados. Hoje fica abaixo de R$ 200.",
    nome: "Fernanda",
    lugar: "Jardim Itália",
    tipo: "casa",
  },
  {
    texto: "Mostraram foto do telhado antes e depois, telha por telha. Choveu muito em janeiro e nenhuma goteira.",
    nome: "Benedito",
    lugar: "Coxipó",
    tipo: "casa",
  },
  {
    texto: "A parcela do financiamento rural ficou menor que a economia na conta do sítio.",
    nome: "Rogério",
    lugar: "Santo Antônio de Leverger",
    tipo: "sítio",
  },
];
```

Crie `content/simulador.ts`:

```ts
import type { ConstantesSimulador } from "./tipos";

/** Constantes do simulador (spec, seção 7). Para outro cliente, ajuste à distribuidora e à região. */
export const constantesSimulador: ConstantesSimulador = {
  // Estimativa com impostos. A tarifa B1 da Energisa MT é R$ 0,899 sem impostos desde 08/04/2026.
  tarifa: 1.15,
  // Ligação bifásica: a Energisa cobra pelo menos 50 kWh por mês.
  taxaMinimaKwh: 50,
  // Valor conservador para Cuiabá. Confirmar no SunData do CRESESB.
  geracaoKwhPorKwpDia: 4.3,
  potenciaPlacaW: 585,
  // Perda do Fio B em 2026 sobre a energia compensada.
  perdaFioB: 0.15,
  // Margem da faixa de economia, para mais e para menos.
  margem: 0.07,
  // Deslizador: de R$ 150 a R$ 3.000, de 10 em 10, começando em R$ 450.
  minimo: 150,
  maximo: 3000,
  passo: 10,
  inicial: 450,
};
```

Crie `content/formulario.ts`:

```ts
import type { TextosFormulario } from "./tipos";

export const formulario: TextosFormulario = {
  campos: {
    nome: "Nome",
    whatsapp: "WhatsApp com DDD",
    cidade: "Cidade e bairro",
    conta: "Valor médio da conta",
    onde: "Onde quer instalar",
    mensagem: "Mensagem",
  },
  opcional: "opcional",
  escolha: "Escolha uma opção",
  opcoesConta: ["Até R$ 300", "R$ 300 a R$ 600", "R$ 600 a R$ 1.000", "Mais de R$ 1.000"],
  opcoesOnde: ["Casa", "Empresa", "Fazenda ou sítio"],
  botao: "Quero meu orçamento",
  enviando: "Enviando…",
  privacidade: "Usamos seus dados só para responder este pedido.",
  aviso: "Formulário de demonstração. A mensagem chega para quem fez este site.",
  erros: {
    nome: "Coloque seu nome.",
    nomeLongo: "Use até 80 caracteres no nome.",
    whatsapp: "Confira o número do WhatsApp, com DDD.",
    cidade: "Use até 80 caracteres na cidade e no bairro.",
    conta: "Escolha o valor médio da conta.",
    onde: "Escolha onde quer instalar.",
    mensagem: "Use até 1.000 caracteres na mensagem.",
    envio: "Não conseguimos enviar agora. Tente de novo ou chame a gente no WhatsApp.",
  },
  sucesso: "Pedido recebido, {nome}! Respondemos no WhatsApp em até 1 dia útil.",
  sucessoConceito:
    "Mensagem recebida, {nome}! Como este é um projeto conceito, ela chegou para Gustavo Walien, que fez este site.",
};
```

- [ ] **Passo 5: Rodar e ver passar**

Rode: `npm test`
Esperado: PASS. Os 7 testes novos passam, e o portão de texto confere os 6 arquivos novos sem travessão nem palavra de estoque.

- [ ] **Passo 6: Commit**

```bash
git add content tests/unit/conteudo-inicio.test.ts
git commit -m "feat: conteúdo da Início (hero, seções, simulador e formulário)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 3: Conta do simulador

**Arquivos:**
- Criar: `lib/simulador.ts`, `lib/texto.ts`
- Teste: `tests/unit/simulador.test.ts`

**Interfaces:**
- Consome: `ConstantesSimulador` e `constantesSimulador` (Tarefa 2).
- Produz:
  - `estimar(conta: number, c: ConstantesSimulador): Estimativa`, com `Estimativa = { placas: number; kwp: number; economiaMes: [number, number]; economiaAno: [number, number] }`;
  - `milhar(valor: number): string`, que dá "1.039";
  - `reais(valor: number): string`, que dá "R$ 1.039";
  - `decimal(valor: number): string`, que dá "2,9";
  - `preencher(modelo: string, valores: Record<string, string>): string`, em `lib/texto.ts`.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/unit/simulador.test.ts`. Os números foram conferidos à mão com a fórmula da spec:

```ts
import { describe, expect, it } from "vitest";
import { constantesSimulador as c } from "@/content/simulador";
import { decimal, estimar, milhar, reais } from "@/lib/simulador";
import { preencher } from "@/lib/texto";

describe("estimar", () => {
  it("R$ 450 dá 5 placas, 2,9 kWp e R$ 310 a R$ 357 por mês (referência da spec)", () => {
    const e = estimar(450, c);
    expect(e.placas).toBe(5);
    expect(decimal(e.kwp)).toBe("2,9");
    expect(e.economiaMes).toEqual([310, 357]);
    expect(e.economiaAno).toEqual([3720, 4284]);
  });

  it("R$ 1.200 dá 14 placas e R$ 903 a R$ 1.039 por mês (referência da spec)", () => {
    const e = estimar(1200, c);
    expect(e.placas).toBe(14);
    expect(decimal(e.kwp)).toBe("8,2");
    expect(e.economiaMes).toEqual([903, 1039]);
  });

  it("nos limites do deslizador: R$ 150 e R$ 3.000", () => {
    expect(estimar(150, c)).toEqual({ placas: 2, kwp: 1.17, economiaMes: [73, 84], economiaAno: [876, 1008] });
    const alto = estimar(3000, c);
    expect(alto.placas).toBe(34);
    expect(alto.economiaMes).toEqual([2326, 2676]);
  });

  it("conta abaixo da taxa mínima: uma placa e economia zero", () => {
    expect(estimar(40, c)).toEqual({ placas: 1, kwp: 0.585, economiaMes: [0, 0], economiaAno: [0, 0] });
  });

  it("quanto maior a conta, mais placas e mais economia", () => {
    let anterior = estimar(c.minimo, c);
    for (let conta = c.minimo + c.passo; conta <= c.maximo; conta += c.passo) {
      const atual = estimar(conta, c);
      expect(atual.placas).toBeGreaterThanOrEqual(anterior.placas);
      expect(atual.economiaMes[0]).toBeGreaterThanOrEqual(anterior.economiaMes[0]);
      anterior = atual;
    }
  });
});

describe("formatos", () => {
  it("reais sem centavos e com ponto de milhar", () => {
    expect(milhar(1200)).toBe("1.200");
    expect(reais(1039)).toBe("R$ 1.039");
    expect(reais(310)).toBe("R$ 310");
  });

  it("uma casa decimal com vírgula", () => {
    expect(decimal(2.925)).toBe("2,9");
    expect(decimal(19.89)).toBe("19,9");
  });

  it("preencher troca as chaves e deixa as desconhecidas", () => {
    expect(preencher("R$ {valor}, {nome}!", { valor: "450" })).toBe("R$ 450, {nome}!");
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/simulador.test.ts`
Esperado: FAIL com "Failed to resolve import "@/lib/simulador"".

- [ ] **Passo 3: Escrever a conta e os formatos**

Crie `lib/simulador.ts`:

```ts
import type { ConstantesSimulador } from "@/content/tipos";

export type Estimativa = {
  placas: number;
  kwp: number;
  /** Faixa de economia por mês, em reais inteiros: [menor, maior]. */
  economiaMes: [number, number];
  economiaAno: [number, number];
};

/** A conta da spec (seção 7), a partir do valor da conta de luz em reais por mês. */
export function estimar(conta: number, c: ConstantesSimulador): Estimativa {
  const consumo = conta / c.tarifa;
  const compensavel = Math.max(0, consumo - c.taxaMinimaKwh);
  const placas = Math.max(1, Math.ceil(((compensavel / (c.geracaoKwhPorKwpDia * 30)) * 1000) / c.potenciaPlacaW));
  const kwp = (placas * c.potenciaPlacaW) / 1000;
  const economia = compensavel * c.tarifa * (1 - c.perdaFioB);
  const economiaMes: [number, number] = [
    Math.round(economia * (1 - c.margem)),
    Math.round(economia * (1 + c.margem)),
  ];
  return { placas, kwp, economiaMes, economiaAno: [economiaMes[0] * 12, economiaMes[1] * 12] };
}

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

/** "1.200" */
export const milhar = (valor: number) => inteiro.format(valor);
/** "R$ 1.200", sem centavos. */
export const reais = (valor: number) => `R$ ${milhar(valor)}`;
/** "2,9" */
export const decimal = (valor: number) => umaCasa.format(valor);
```

Crie `lib/texto.ts`:

```ts
/** Troca cada {chave} do modelo pelo valor. Chave sem valor fica como está. */
export function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (trecho, chave: string) => valores[chave] ?? trecho);
}
```

- [ ] **Passo 4: Rodar e ver passar**

Rode: `npx vitest run tests/unit/simulador.test.ts && npm test`
Esperado: PASS, com 8 testes novos e a bateria inteira verde.

- [ ] **Passo 5: Commit**

```bash
git add lib/simulador.ts lib/texto.ts tests/unit/simulador.test.ts
git commit -m "feat: conta do simulador com as referências da spec

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 4: Simulador na tela, com a seção e o rótulo comuns

**Arquivos:**
- Criar: `components/ui/Rotulo.tsx`, `components/ui/Secao.tsx`, `components/ui/secao.css`, `components/inicio/Simulador.tsx`, `components/inicio/SecaoSimulador.tsx`, `components/inicio/simulador.css`
- Modificar: `app/globals.css`, `app/page.tsx`, `tests/unit/modo-desligado.test.tsx`
- Teste: `tests/e2e/simulador.spec.ts`

**Interfaces:**
- Consome:
  - `estimar`, `reais`, `milhar` e `decimal` (Tarefa 3);
  - `preencher` (Tarefa 3);
  - `inicio`, `constantesSimulador`, `config` e `empresa`;
  - `destinoWhatsapp(config, empresa, mensagem)` (Plano 1).
- Produz:
  - `Rotulo({ children, className? })`;
  - `Secao({ id, titulo, rotulo?, className?, children })`, que gera `<section id aria-labelledby="{id}-titulo">` com `h2#{id}-titulo.secao__titulo`;
  - `Simulador()` (cliente, sem props, reusado no blog no Plano 4);
  - `SecaoSimulador()`, que gera `<section id="simulador">`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/simulador.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("simulador", () => {
  test("começa em R$ 450 e muda os números ao arrastar", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#simulador");
    const deslizador = secao.getByRole("slider", { name: "Valor médio da sua conta de luz" });
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 450 por mês");
    await expect(secao).toContainText("5 placas · 2,9 kWp");
    await expect(secao).toContainText("R$ 310 a R$ 357 por mês");
    await deslizador.fill("1200");
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 1.200 por mês");
    await expect(secao).toContainText("14 placas · 8,2 kWp");
    await expect(secao).toContainText("R$ 903 a R$ 1.039 por mês");
    await expect(secao).toContainText("R$ 10.836 a R$ 12.468");
  });

  test("as setas do teclado andam de 10 em 10", async ({ page }) => {
    await page.goto("/");
    const deslizador = page.locator("#simulador").getByRole("slider");
    await deslizador.focus();
    await page.keyboard.press("ArrowRight");
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 460 por mês");
  });

  test("os resultados ficam numa região que avisa o leitor de tela", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#simulador [aria-live='polite']")).toContainText("Economia estimada");
  });

  test("o botão leva ao WhatsApp do autor e abre o aviso do projeto conceito", async ({ page }) => {
    await page.goto("/");
    const botao = page.getByRole("link", { name: "Quero a simulação completa" });
    await expect(botao).toHaveAttribute("href", /^https:\/\/wa\.me\/5565981222210\?text=/);
    await botao.click();
    await expect(page.getByRole("dialog", { name: "Este é um projeto conceito." })).toBeVisible();
  });
});

test.describe("simulador sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mostra a estimativa de R$ 450", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#simulador")).toContainText("R$ 310 a R$ 357 por mês");
  });
});
```

No fim de `tests/unit/modo-desligado.test.tsx`, dentro do `describe("modo conceito desligado", …)`, acrescente:

```tsx
  it("o simulador leva ao WhatsApp da empresa com o valor da conta", async () => {
    const { Simulador } = await import("@/components/inicio/Simulador");
    const html = renderToStaticMarkup(<Simulador />);
    expect(html).toContain("https://wa.me/5565999998888?text=");
    expect(html).toContain(encodeURIComponent("Minha conta de luz fica em torno de R$ 450."));
    expect(html).not.toContain("data-aviso");
  });
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/modo-desligado.test.tsx`
Esperado: FAIL com "Failed to resolve import "@/components/inicio/Simulador"".

Rode: `npx playwright test tests/e2e/simulador.spec.ts`
Esperado: FAIL nos 5 testes, porque não existe `#simulador` na página.

- [ ] **Passo 3: Rótulo e seção comuns**

Crie `components/ui/Rotulo.tsx`:

```tsx
import type { ReactNode } from "react";

/** Rótulo pequeno em mono, acima do título de uma seção. */
export function Rotulo({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={className ? `rotulo ${className}` : "rotulo"}>{children}</p>;
}
```

Crie `components/ui/Secao.tsx`:

```tsx
import type { ReactNode } from "react";
import { Rotulo } from "./Rotulo";

type Props = { id: string; titulo: string; rotulo?: string; className?: string; children: ReactNode };

/** Seção da página: rótulo opcional, título H2 e conteúdo, na largura do site. */
export function Secao({ id, titulo, rotulo, className, children }: Props) {
  return (
    <section id={id} className={className ? `secao ${className}` : "secao"} aria-labelledby={`${id}-titulo`}>
      <div className="secao__miolo">
        {rotulo && <Rotulo>{rotulo}</Rotulo>}
        <h2 id={`${id}-titulo`} className="secao__titulo">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}
```

Crie `components/ui/secao.css`:

```css
@layer components {
  .secao {
    padding: clamp(72px, 10vw, 128px) 16px;
  }
  .secao__miolo {
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .secao__titulo {
    max-width: 18ch;
    font-weight: 800;
    font-size: clamp(2rem, 4.4vw, 3.4rem);
    line-height: 1.02;
  }
  .rotulo {
    margin-bottom: 14px;
    font: 500 0.78rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-rotulo);
  }
  .escuro .rotulo {
    color: var(--color-ipe);
  }
}
```

- [ ] **Passo 4: O simulador**

Crie `components/inicio/Simulador.tsx`:

```tsx
"use client";

import { useId, useState, type CSSProperties } from "react";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { inicio } from "@/content/inicio";
import { constantesSimulador as c } from "@/content/simulador";
import { destinoWhatsapp } from "@/lib/contato";
import { decimal, estimar, milhar, reais } from "@/lib/simulador";
import { preencher } from "@/lib/texto";

const t = inicio.simulador;

/** O simulador de economia: o deslizador da conta de luz e a estimativa na hora. Sem JavaScript, mostra R$ 450. */
export function Simulador() {
  const [conta, setConta] = useState(c.inicial);
  const id = useId();
  const e = estimar(conta, c);
  const destino = destinoWhatsapp(config, empresa, preencher(t.mensagem, { valor: milhar(conta) }));
  const cheio = ((conta - c.minimo) / (c.maximo - c.minimo)) * 100;

  return (
    <div className="simulador">
      <div className="simulador__entrada">
        <label className="simulador__rotulo" htmlFor={`${id}-conta`}>
          {t.controle}
        </label>
        <output className="simulador__valor" htmlFor={`${id}-conta`}>
          {reais(conta)}
        </output>
        <input
          id={`${id}-conta`}
          className="simulador__deslizador"
          type="range"
          min={c.minimo}
          max={c.maximo}
          step={c.passo}
          value={conta}
          aria-valuetext={`${reais(conta)} ${t.porMes}`}
          onChange={(evento) => setConta(Number(evento.target.value))}
          style={{ "--cheio": `${cheio}%` } as CSSProperties}
        />
        <div className="simulador__escala" aria-hidden="true">
          <span>{reais(c.minimo)}</span>
          <span>{reais(c.maximo)}</span>
        </div>
      </div>
      <div className="simulador__resultados" aria-live="polite">
        <div className="simulador__cartao">
          <p className="simulador__nome">{t.sistema}</p>
          <p className="simulador__numero">
            {e.placas} placas · {decimal(e.kwp)} kWp
          </p>
        </div>
        <div className="simulador__cartao simulador__cartao--destaque">
          <p className="simulador__nome">{t.economia}</p>
          <p className="simulador__numero">
            {reais(e.economiaMes[0])} a {reais(e.economiaMes[1])} <small>{t.porMes}</small>
          </p>
        </div>
        <div className="simulador__cartao">
          <p className="simulador__nome">{t.ano}</p>
          <p className="simulador__numero">
            {reais(e.economiaAno[0])} a {reais(e.economiaAno[1])}
          </p>
        </div>
      </div>
      <div className="simulador__rodape">
        <p className="simulador__aviso">{t.aviso}</p>
        <details className="simulador__como">
          <summary>{t.comoTitulo}</summary>
          <ol>
            {t.comoTexto.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
          </ol>
        </details>
        <a
          className="botao botao--ipe"
          href={destino.href}
          target="_blank"
          rel="noopener"
          data-aviso={destino.aviso ? "" : undefined}
        >
          {t.botao}
        </a>
      </div>
    </div>
  );
}
```

Crie `components/inicio/SecaoSimulador.tsx`:

```tsx
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { Simulador } from "./Simulador";

/** A seção do simulador na Início: o momento interativo da página. */
export function SecaoSimulador() {
  return (
    <Secao id="simulador" rotulo={inicio.simulador.rotulo} titulo={inicio.simulador.titulo} className="secao--simulador">
      <Simulador />
    </Secao>
  );
}
```

Crie `components/inicio/simulador.css`:

```css
/* Painel dividido: a entrada em azul-céu claro à esquerda e os resultados em cartões à direita. */
@layer components {
  .simulador {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    margin-top: 40px;
    overflow: hidden;
    border: 2.5px solid var(--color-profundo);
    border-radius: 22px;
    background: var(--color-papel);
    box-shadow: var(--shadow-dura);
  }
  .simulador__entrada {
    display: grid;
    align-content: start;
    gap: 12px;
    padding: 32px;
    background: var(--color-ceu-claro);
    border-right: 2.5px solid var(--color-profundo);
  }
  .simulador__rotulo {
    font-weight: 600;
  }
  .simulador__valor {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.6rem, 6vw, 4rem);
    line-height: 1;
  }
  .simulador__deslizador {
    width: 100%;
    height: 44px;
    margin: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  .simulador__deslizador::-webkit-slider-runnable-track {
    height: 14px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 999px;
    background:
      linear-gradient(var(--color-ipe), var(--color-ipe)) 0 0 / var(--cheio, 50%) 100% no-repeat,
      var(--color-papel);
  }
  .simulador__deslizador::-webkit-slider-thumb {
    width: 30px;
    height: 30px;
    margin-top: -10.5px;
    appearance: none;
    border: 2.5px solid var(--color-profundo);
    border-radius: 50%;
    background: var(--color-ipe);
    box-shadow: 0 3px 0 var(--color-profundo);
  }
  .simulador__deslizador::-moz-range-track {
    height: 9px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 999px;
    background:
      linear-gradient(var(--color-ipe), var(--color-ipe)) 0 0 / var(--cheio, 50%) 100% no-repeat,
      var(--color-papel);
  }
  .simulador__deslizador::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 50%;
    background: var(--color-ipe);
    box-shadow: 0 3px 0 var(--color-profundo);
  }
  .simulador__escala {
    display: flex;
    justify-content: space-between;
    font: 500 0.78rem/1 var(--font-mono);
    color: var(--color-tinta-suave);
  }
  .simulador__resultados {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 32px;
  }
  .simulador__cartao {
    padding: 16px 18px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 16px;
    background: var(--color-papel);
  }
  .simulador__cartao--destaque {
    background: var(--color-ipe);
    box-shadow: var(--shadow-dura);
  }
  .simulador__nome {
    font: 500 0.74rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .simulador__numero {
    margin-top: 8px;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 1.1;
  }
  .simulador__numero small {
    font-family: var(--font-texto);
    font-weight: 600;
    font-size: 1rem;
  }
  .simulador__rodape {
    grid-column: 1 / -1;
    display: grid;
    justify-items: start;
    gap: 16px;
    padding: 24px 32px 32px;
    border-top: 2.5px solid var(--color-profundo);
  }
  .simulador__aviso {
    max-width: 70ch;
    color: var(--color-tinta-suave);
  }
  .simulador__como summary {
    display: flex;
    align-items: center;
    min-height: 44px;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;
  }
  .simulador__como ol {
    display: grid;
    gap: 6px;
    margin-top: 8px;
    padding-left: 1.2em;
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .simulador {
      grid-template-columns: 1fr;
    }
    .simulador__entrada {
      padding: 24px;
      border-right: 0;
      border-bottom: 2.5px solid var(--color-profundo);
    }
    .simulador__resultados,
    .simulador__rodape {
      padding: 24px;
    }
  }
}
```

- [ ] **Passo 5: Ligar na Início**

Em `app/globals.css`, acrescente depois do `@import "../components/ui/botao.css";`:

```css
@import "../components/ui/secao.css";
```

e, depois do `@import "../components/layout/rodape.css";`:

```css
@import "../components/inicio/simulador.css";
```

Troque `app/page.tsx` por:

```tsx
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export default function Inicio() {
  return (
    <>
      <EmConstrucao
        titulo="Energia solar em Cuiabá."
        texto="A página Início chega no Plano 2, com o hero animado, o simulador e o formulário."
      />
      <SecaoSimulador />
    </>
  );
}
```

A Tarefa 6 troca o `EmConstrucao` pelo hero.

- [ ] **Passo 6: Rodar e ver passar**

Rode: `npm test && npx playwright test tests/e2e/simulador.spec.ts tests/e2e/base.spec.ts`
Esperado: PASS. O teste da base continua com um H1 só e nada saindo pela direita.

- [ ] **Passo 7: Commit**

```bash
git add components/ui components/inicio app/globals.css app/page.tsx tests/e2e/simulador.spec.ts tests/unit/modo-desligado.test.tsx
git commit -m "feat: simulador de economia na Início

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: Geometria do hero

Tudo o que o protótipo v4 calculava no navegador vira função pura, testada. O servidor usa essas funções para mandar o SVG pronto, e o motor (Tarefa 7) usa as mesmas para animar.

**Arquivos:**
- Criar: `components/hero/geometria.ts`
- Teste: `tests/unit/hero-geometria.test.ts`

**Interfaces:**
- Consome: o tipo `Trecho` (Tarefa 2).
- Produz:

  | Nome | O quê |
  |---|---|
  | `Ponto`, `Orientacao` | tipos |
  | `VIEWBOX`, `AJUSTE`, `ARCOS` | enquadramento e caminho do sol por orientação |
  | `FAIXAS`, `PARALAXE`, `AMOSTRAS` | faixas de texto, fatores de paralaxe e pontos guardados do caminho |
  | `clamp`, `suave(p, a, b)`, `arred` | utilitários |
  | `dDoArco(arco)` | o atributo `d` do caminho |
  | `amostrarArco(arco, n?)` | pontos igualmente espaçados no caminho |
  | `minutosDoSol(t)`, `tDosMinutos(m)`, `relogio(t)` | o relógio de 05:40 a 12:00 |
  | `solNoCaminho(p)` | onde o sol está no caminho |
  | `marcasDeHora(amostras)` | as marcas "07:00" e "09:00" |
  | `opacidadeDaFaixa(p, i)`, `montagemDaFaixa(p, i)` | entrada e montagem das faixas de texto |
  | `ESTRELAS`, `RAIOS`, `PLACAS`, `PETALAS` | os elementos repetidos da cena |
  | `Placa` | tipo de cada placa |
  | `dividirEmPalavras(titulo)`, `textoCorrido(titulo)`, `Palavra` | o título em palavras para a montagem |

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/unit/hero-geometria.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  ARCOS,
  ESTRELAS,
  PETALAS,
  PLACAS,
  RAIOS,
  amostrarArco,
  dDoArco,
  dividirEmPalavras,
  marcasDeHora,
  montagemDaFaixa,
  opacidadeDaFaixa,
  relogio,
  solNoCaminho,
  suave,
  tDosMinutos,
  textoCorrido,
} from "@/components/hero/geometria";

describe("geometria do hero", () => {
  it("suave vai de 0 a 1 entre a e b", () => {
    expect(suave(0, 0.2, 0.4)).toBe(0);
    expect(suave(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(suave(1, 0.2, 0.4)).toBe(1);
  });

  it("o relógio vai de 05:40 a 12:00, com 06:00 quando o sol aparece", () => {
    expect(relogio(0)).toBe("05:40");
    expect(relogio(0.2)).toBe("06:00");
    expect(relogio(1)).toBe("12:00");
    expect(tDosMinutos(720)).toBe(1);
  });

  it("o sol sai do começo do caminho e chega ao fim antes do último pedaço do scroll", () => {
    expect(solNoCaminho(0)).toBe(0);
    expect(solNoCaminho(0.94)).toBe(1);
    expect(solNoCaminho(1)).toBe(1);
    expect(solNoCaminho(0.3)).toBeGreaterThan(solNoCaminho(0.2));
  });

  it("o caminho vira uma curva quadrática", () => {
    expect(dDoArco(ARCOS.paisagem)).toBe("M1530 780 Q1440 170 1150 225");
  });

  it("os pontos do caminho começam e terminam nas pontas e são igualmente espaçados", () => {
    const pontos = amostrarArco(ARCOS.paisagem);
    expect(pontos).toHaveLength(241);
    expect(pontos[0]![0]).toBeCloseTo(1530);
    expect(pontos[0]![1]).toBeCloseTo(780);
    expect(pontos[240]![0]).toBeCloseTo(1150);
    expect(pontos[240]![1]).toBeCloseTo(225);
    const passos = pontos.slice(1).map((p, i) => Math.hypot(p[0] - pontos[i]![0], p[1] - pontos[i]![1]));
    expect(Math.max(...passos) / Math.min(...passos)).toBeLessThan(1.02);
  });

  it("as marcas de hora ficam a 70 unidades do caminho", () => {
    const pontos = amostrarArco(ARCOS.paisagem);
    const marcas = marcasDeHora(pontos);
    expect(marcas.map((m) => m.texto)).toEqual(["07:00", "09:00"]);
    for (const m of marcas) {
      const perto = Math.min(...pontos.map(([x, y]) => Math.hypot(x - m.x, y - m.y)));
      expect(perto).toBeGreaterThan(66);
      expect(perto).toBeLessThan(71);
    }
  });

  it("cada faixa de texto aparece só no seu trecho", () => {
    expect(opacidadeDaFaixa(0, 0)).toBe(1);
    expect(opacidadeDaFaixa(0.3, 0)).toBe(0);
    expect(opacidadeDaFaixa(0.3, 1)).toBe(0);
    expect(opacidadeDaFaixa(0.5, 1)).toBe(1);
    expect(opacidadeDaFaixa(0.7, 1)).toBe(0);
    expect(opacidadeDaFaixa(0.6, 2)).toBe(0);
    expect(opacidadeDaFaixa(1, 2)).toBe(1);
  });

  it("a montagem das palavras vai de 0 a 1 no começo da faixa; a primeira já vem montada", () => {
    expect(montagemDaFaixa(0, 0)).toBe(1);
    expect(montagemDaFaixa(0.36, 1)).toBe(0);
    expect(montagemDaFaixa(0.5, 1)).toBe(1);
  });

  it("oito placas com ordens de 0 a 7, doze raios, oito estrelas e doze pétalas", () => {
    expect(PLACAS.map((p) => p.ordem).sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(PLACAS.map((p) => p.id)).size).toBe(8);
    for (const p of PLACAS) expect(p.quad.split(" ")).toHaveLength(4);
    expect(RAIOS).toHaveLength(12);
    expect(ESTRELAS).toHaveLength(8);
    expect(PETALAS).toHaveLength(12);
  });

  it("divide o título em palavras sem perder o destaque e com a pontuação colada", () => {
    const titulo = [{ texto: "Em Cuiabá, o sol " }, { texto: "chega cedo", destaque: true }, { texto: "." }];
    const palavras = dividirEmPalavras(titulo);
    expect(palavras).toHaveLength(6);
    expect(palavras[4]).toEqual({ i: 4, partes: [{ texto: "chega", destaque: true }] });
    expect(palavras[5]).toEqual({ i: 5, partes: [{ texto: "cedo", destaque: true }, { texto: "." }] });
    expect(textoCorrido(titulo)).toBe("Em Cuiabá, o sol chega cedo.");
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/hero-geometria.test.ts`
Esperado: FAIL com "Failed to resolve import "@/components/hero/geometria"".

- [ ] **Passo 3: Escrever a geometria**

Crie `components/hero/geometria.ts`. Os valores vêm do protótipo v4, como constantes com nome:

```ts
import type { Trecho } from "@/content/tipos";

export type Ponto = [number, number];
export type Orientacao = "paisagem" | "retrato";
type Curva = [Ponto, Ponto, Ponto];

/** Enquadramento da cena. No retrato, a câmera foca a casa e o ipê. */
export const VIEWBOX: Record<Orientacao, string> = { paisagem: "0 0 1600 900", retrato: "780 300 750 600" };
/** Na paisagem, a cena fica ancorada à direita, para a casa nunca sair da tela. */
export const AJUSTE: Record<Orientacao, string> = { paisagem: "xMaxYMax slice", retrato: "xMidYMax meet" };

/** Caminho do sol: início, controle e fim de uma curva quadrática. No retrato, o sol termina ao lado do texto. */
export const ARCOS: Record<Orientacao, Curva> = {
  paisagem: [
    [1530, 780],
    [1440, 170],
    [1150, 225],
  ],
  retrato: [
    [1600, 820],
    [1540, 280],
    [1360, 250],
  ],
};

/** Faixas de texto: [entra, sai] no progresso do hero (madrugada, manhã e meio-dia). */
export const FAIXAS: readonly [number, number][] = [
  [0, 0.24],
  [0.36, 0.64],
  [0.72, 1],
];

/** Quanto cada camada da paisagem se desloca no scroll. */
export const PARALAXE = { longe: 0.15, meio: 0.35, perto: 0.6, frente: 1 } as const;

/** Quantos pedaços do caminho do sol o motor guarda. */
export const AMOSTRAS = 240;

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Passagem suave de 0 a 1 entre a e b (smoothstep). */
export function suave(p: number, a: number, b: number): number {
  const t = clamp((p - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Arredonda para uma casa decimal, para o SVG sair curto. */
export const arred = (n: number) => Math.round(n * 10) / 10;
const xy = ([x, y]: Ponto) => `${arred(x)},${arred(y)}`;

export function dDoArco([a, c, b]: Curva): string {
  return `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
}

function naCurva([a, c, b]: Curva, t: number): Ponto {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

/** n + 1 pontos do caminho, igualmente espaçados pelo comprimento (como o getPointAtLength do navegador). */
export function amostrarArco(arco: Curva, n = AMOSTRAS): Ponto[] {
  const FINO = 2000;
  const pontos: Ponto[] = [];
  const acumulado: number[] = [];
  for (let i = 0; i <= FINO; i++) {
    const ponto = naCurva(arco, i / FINO);
    const anterior = pontos[i - 1];
    acumulado.push(anterior ? acumulado[i - 1] + Math.hypot(ponto[0] - anterior[0], ponto[1] - anterior[1]) : 0);
    pontos.push(ponto);
  }
  const total = acumulado[FINO];
  const saida: Ponto[] = [];
  let j = 0;
  for (let k = 0; k <= n; k++) {
    const alvo = (total * k) / n;
    while (j < FINO - 1 && acumulado[j + 1] < alvo) j++;
    const f = clamp((alvo - acumulado[j]) / (acumulado[j + 1] - acumulado[j] || 1), 0, 1);
    const [x0, y0] = pontos[j];
    const [x1, y1] = pontos[j + 1];
    saida.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]);
  }
  return saida;
}

/** Minutos do relógio no ponto t do caminho: 05:40 até o sol aparecer (t = 0,2), depois de 06:00 a 12:00. */
export function minutosDoSol(t: number): number {
  return t <= 0.2 ? 340 + (t / 0.2) * 20 : 360 + ((t - 0.2) / 0.8) * 360;
}
export const tDosMinutos = (m: number) => 0.2 + ((m - 360) / 360) * 0.8;
export function relogio(t: number): string {
  const m = Math.round(minutosDoSol(t));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Onde o sol está no caminho (0 a 1): sobe rápido no começo e desacelera até o meio-dia. */
export function solNoCaminho(p: number): number {
  return 1 - Math.pow(1 - clamp(p / 0.94, 0, 1), 1.9);
}

export type MarcaDeHora = { texto: string; t: number; x: number; y: number };

/** Marcas "07:00" e "09:00" ao lado do caminho, a 70 unidades da curva, que aparecem depois que o sol passa. */
export function marcasDeHora(amostras: Ponto[]): MarcaDeHora[] {
  const n = amostras.length - 1;
  return (
    [
      [420, "07:00"],
      [540, "09:00"],
    ] as const
  ).map(([minutos, texto]) => {
    const t = tDosMinutos(minutos);
    const i = Math.round(t * n);
    const [x, y] = amostras[i];
    const [x2, y2] = amostras[Math.min(n, i + 1)];
    const L = Math.hypot(x2 - x, y2 - y) || 1;
    return { texto, t, x: arred(x - ((y2 - y) / L) * 70), y: arred(y + ((x2 - x) / L) * 70) };
  });
}

/** Opacidade da faixa i no progresso p: a primeira já começa visível e a última não sai mais. */
export function opacidadeDaFaixa(p: number, i: number): number {
  const [a, b] = FAIXAS[i];
  const r = Math.min(0.02, (b - a) / 3);
  const entra = i === 0 ? 1 : suave(p, a, a + r);
  const sai = i === FAIXAS.length - 1 ? 1 : 1 - suave(p, b - r, b);
  return entra * sai;
}

/** Montagem das palavras da faixa i (o --k do CSS), em degraus de 0,008 para escrever pouco no DOM. */
export function montagemDaFaixa(p: number, i: number): number {
  if (i === 0) return 1;
  const [a, b] = FAIXAS[i];
  const k = clamp((p - a) / Math.min(0.025, (b - a) * 0.35), 0, 1);
  return Math.round(k / 0.008) * 0.008;
}

/** Estrelas que piscam: posição em % da tela e atraso da animação. */
export const ESTRELAS = (
  [
    [16, 12, 0],
    [29, 5, -1.1],
    [61, 18, -2.3],
    [72, 7, -0.6],
    [86, 15, -1.7],
    [93, 29, -2.8],
    [7, 31, -0.9],
    [54, 34, -2],
  ] as const
).map(([x, y, atraso]) => ({ x, y, atraso }));

/** Raios do sol, longos e curtos alternados. */
export const RAIOS = Array.from({ length: 12 }, (_, i) => {
  const ponta = i % 2 ? 120 : 142;
  return { d: `M-15 -92 Q0 ${-ponta - 14} 15 -92 Z`, rotacao: i * 30 };
});

export type Placa = {
  id: string;
  /** Ordem em que a placa acende: a fileira de baixo primeiro, da esquerda para a direita. */
  ordem: number;
  quad: string;
  celulas: string;
  /** O reflexo que atravessa a placa quando ela acende. */
  faixa: string;
  cx: number;
  cy: number;
  /** Onde nasce a faísca. */
  fx: number;
  fy: number;
  largura: number;
};

/** Ponto do telhado em coordenadas (u, v) de 0 a 1. */
const noTelhado = (u: number, v: number): Ponto => [1090 + 320 * u + 40 * v, 606 - 108 * v];

function criarPlacas(): Placa[] {
  const placas: Placa[] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const u0 = 0.06 + c * 0.22 + 0.014;
      const u1 = 0.06 + (c + 1) * 0.22 - 0.014;
      const v0 = 0.14 + r * 0.38 + 0.03;
      const v1 = 0.14 + (r + 1) * 0.38 - 0.03;
      const quad = [noTelhado(u0, v0), noTelhado(u1, v0), noTelhado(u1, v1), noTelhado(u0, v1)].map(xy).join(" ");
      const [cx, cy] = noTelhado((u0 + u1) / 2, (v0 + v1) / 2);
      const linhas = [1 / 3, 2 / 3].map(
        (k) => `M${xy(noTelhado(u0 + (u1 - u0) * k, v0))} L${xy(noTelhado(u0 + (u1 - u0) * k, v1))}`,
      );
      linhas.push(`M${xy(noTelhado(u0, (v0 + v1) / 2))} L${xy(noTelhado(u1, (v0 + v1) / 2))}`);
      const h = (108 * (v1 - v0)) / 2 + 8;
      const faixa = (
        [
          [cx - 24, cy + h],
          [cx - 8, cy + h],
          [cx + 20, cy - h],
          [cx + 4, cy - h],
        ] as Ponto[]
      )
        .map(xy)
        .join(" ");
      const [fx, fy] = noTelhado(u1, v1);
      placas.push({
        id: `placa-${r}${c}`,
        ordem: (1 - r) * 4 + c,
        quad,
        celulas: linhas.join(" "),
        faixa,
        cx: arred(cx),
        cy: arred(cy),
        fx: arred(fx),
        fy: arred(fy),
        largura: arred(320 * (u1 - u0)),
      });
    }
  }
  return placas;
}

export const PLACAS = criarPlacas();

/** Flores do ipê caindo: posição inicial, duração, atraso e quanto andam para o lado. */
export const PETALAS = Array.from({ length: 12 }, (_, i) => ({
  x: 830 + ((i * 47) % 190),
  y: 480 + ((i * 29) % 110),
  duracao: arred(7 + (i % 5) * 1.3),
  atraso: arred(-i * 1.7),
  vx: (i % 2 ? 1 : -1) * (30 + ((i * 13) % 50)),
}));

export type Palavra = { i: number; partes: Trecho[] };

/** Divide o título em palavras para a montagem. A pontuação fica colada à palavra anterior e o destaque se mantém. */
export function dividirEmPalavras(titulo: Trecho[]): Palavra[] {
  const palavras: Palavra[] = [];
  let atual: Trecho[] = [];
  const fechar = () => {
    if (atual.length) palavras.push({ i: palavras.length, partes: atual });
    atual = [];
  };
  for (const trecho of titulo) {
    for (const pedaco of trecho.texto.split(/(\s+)/)) {
      if (!pedaco) continue;
      if (/^\s+$/.test(pedaco)) {
        fechar();
        continue;
      }
      atual.push(trecho.destaque ? { texto: pedaco, destaque: true } : { texto: pedaco });
    }
  }
  fechar();
  return palavras;
}

export const textoCorrido = (titulo: Trecho[]) => titulo.map((t) => t.texto).join("");
```

- [ ] **Passo 4: Rodar e ver passar**

Rode: `npx vitest run tests/unit/hero-geometria.test.ts && npm test`
Esperado: PASS, com 10 testes novos e a bateria inteira verde.

- [ ] **Passo 5: Commit**

```bash
git add components/hero/geometria.ts tests/unit/hero-geometria.test.ts
git commit -m "feat: geometria do hero em funções puras

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 6: Hero no servidor

O desenho e os textos do hero saem prontos no HTML, no estado da madrugada, que é o progresso 0. Sem JavaScript e com movimento reduzido, o CSS mostra o meio-dia numa tela.

O motor que anima chega na Tarefa 7. Entre as duas tarefas, o hero aparece parado na madrugada.

**Arquivos:**
- Criar:
  - `components/hero/Hero.tsx` e `components/hero/Faixa.tsx`;
  - `components/hero/hero.css`;
  - em `components/hero/camadas/`: `Camada.tsx`, `formas.tsx`, `Ceu.tsx`, `Arco.tsx`, `Sol.tsx`, `Nuvens.tsx`, `Ave.tsx`, `Longe.tsx`, `Meio.tsx`, `Perto.tsx`, `Ipe.tsx`, `Casa.tsx` e `Frente.tsx`.
- Modificar: `app/page.tsx`, `app/globals.css`, `tests/e2e/base.spec.ts`, `tests/e2e/barra.spec.ts`
- Teste: `tests/e2e/hero.spec.ts`

**Interfaces:**
- Consome:
  - a geometria inteira (Tarefa 5);
  - `inicio.hero` (Tarefa 2);
  - `LinkWhatsapp` (Plano 1).
- Produz: o DOM que o `MotorDoHero` (Tarefa 7) lê e escreve. Todos os nomes abaixo são contrato com a Tarefa 7.

  | Seletor | O quê |
  |---|---|
  | `section#hero.hero` | a seção |
  | `#hero-palco` | o palco |
  | `.hero__cena` | a cena |
  | `.hero__camada`, `.hero__paisagem[data-paralaxe]` | as camadas e as de paralaxe |
  | `#hero-sol`, `#hero-ave`, `#hero-noite`, `#hero-lua`, `#hero-nuvens` | os elementos do céu |
  | `#hero-ceu-nascer`, `#hero-ceu-manha`, `#hero-ceu-dia` | os céus que se misturam |
  | `#hero-brilho-nascer`, `#hero-sombra-noite` | as camadas de luz e sombra |
  | `#hero-arco-mascara`, `.hero__arco`, `.hero__hora[data-t]` | o caminho do sol e as marcas de hora |
  | `#hero-sombra-ipe`, `#hero-sombra-casa`, `#hero-janelas`, `#hero-fluxo`, `#hero-vento`, `#hero-ponteiro`, `#hero-casa` | os elementos animados da paisagem |
  | `[data-placa]`, `[data-placa-luz]`, `[data-placa-faixa]`, `[data-placa-faisca]` | as placas, de 0 a 7 |
  | `[data-faixa]` | as faixas de texto, de 0 a 2 |
  | `#hero-hora`, `#hero-kw`, `#hero-barra`, `#hero-dica` | o painel e a dica |

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/hero.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("o H1 junta o rótulo e o título da madrugada, e as três faixas estão no HTML", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", {
      level: 1,
      name: /^Energia solar em Cuiabá\s*Em Cuiabá, o sol chega cedo\.$/,
    });
    await expect(h1).toHaveCount(1);
    await expect(page.locator("[data-faixa]")).toHaveCount(3);
    await expect(page.locator(".hero__faixa--final")).toContainText("A gente faz o projeto");
    await expect(page.locator("[data-placa]")).toHaveCount(8);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
  });
});

test.describe("hero sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mostra o meio-dia numa tela, com os botões finais", async ({ page }) => {
    await page.goto("/");
    const caixa = await page.locator("#hero").boundingBox();
    expect(caixa!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
    const final = page.locator(".hero__faixa--final");
    await expect(final).toHaveCSS("opacity", "1");
    await expect(final.getByRole("link", { name: "Peça seu orçamento" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/5565981222210/,
    );
    await expect(final.getByRole("link", { name: "Simule sua economia" })).toHaveAttribute("href", "#simulador");
    await expect(page.locator(".hero__ceu--dia")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero__faixa--1")).toHaveCSS("opacity", "0");
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/hero.spec.ts`
Esperado: FAIL nos dois testes, porque não existe `#hero` nem `[data-faixa]`.

- [ ] **Passo 3: Ajustar os testes antigos ao hero**

O hero acrescenta um segundo link "Peça seu orçamento" e põe na cena elementos que passam da borda da tela de propósito. O palco os recorta com `overflow: hidden`, e eles não criam rolagem.

Em `tests/e2e/barra.spec.ts`, no teste "no computador: links e chamada para o WhatsApp do autor", troque:

```ts
    const chamada = page.getByRole("link", { name: "Peça seu orçamento" });
```

por:

```ts
    const chamada = page.getByRole("banner").getByRole("link", { name: "Peça seu orçamento" });
```

Em `tests/e2e/base.spec.ts`, no teste "sem rolagem lateral e nada saindo pela direita da tela", troque:

```ts
      .filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > window.innerWidth + 0.5)
```

por:

```ts
      // a cena do hero passa da borda de propósito e o palco a recorta (overflow: hidden)
      .filter((el) => !el.closest("#hero-palco"))
      .filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > window.innerWidth + 0.5)
```

- [ ] **Passo 4: As camadas comuns**

Crie `components/hero/camadas/Camada.tsx`:

```tsx
import type { ReactNode } from "react";
import { AJUSTE, VIEWBOX } from "../geometria";

type Props = { id: string; paralaxe?: number; children: ReactNode };

/** Uma camada da cena em SVG, no enquadramento da paisagem. Com paralaxe, o motor a desloca no scroll. */
export function Camada({ id, paralaxe, children }: Props) {
  return (
    <svg
      id={id}
      className={paralaxe === undefined ? "hero__camada" : "hero__camada hero__paisagem"}
      data-paralaxe={paralaxe}
      viewBox={VIEWBOX.paisagem}
      preserveAspectRatio={AJUSTE.paisagem}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}
```

Crie `components/hero/camadas/formas.tsx`:

```tsx
/** Círculos [cx, cy, r] usados mais de uma vez no desenho. */
export type Circulos = readonly (readonly [number, number, number])[];

export function bolinhas(lista: Circulos) {
  return lista.map(([cx, cy, r]) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />);
}

/** A copa do ipê: o contorno, o amarelo e o recorte das luzes usam os mesmos círculos. */
export const COPA: Circulos = [
  [850, 575, 42],
  [880, 538, 44],
  [932, 518, 50],
  [986, 548, 44],
  [1012, 586, 30],
  [826, 604, 26],
  [900, 486, 36],
  [962, 488, 32],
  [950, 582, 36],
  [900, 590, 30],
];
```

- [ ] **Passo 5: Céu, caminho do sol, sol, nuvens e tuiuiú**

Crie `components/hero/camadas/Ceu.tsx`:

```tsx
import { ESTRELAS } from "../geometria";

/** Quatro céus que se misturam (madrugada, nascer, manhã e meio-dia), com as estrelas e a lua. */
export function Ceu() {
  return (
    <>
      <div className="hero__ceu hero__ceu--madrugada" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--nascer" id="hero-ceu-nascer" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--manha" id="hero-ceu-manha" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--dia" id="hero-ceu-dia" aria-hidden="true" />
      <div className="hero__noite" id="hero-noite" aria-hidden="true">
        {ESTRELAS.map((e) => (
          <svg
            key={`${e.x}-${e.y}`}
            className="hero__estrela"
            viewBox="-10 -10 20 20"
            style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${e.atraso}s` }}
          >
            <path d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z" fill="#FFF6D6" />
          </svg>
        ))}
        <svg className="hero__lua" id="hero-lua" viewBox="-40 -40 80 80">
          <path
            d="M10 -28.3 A30 30 0 1 0 10 28.3 A30.7 30.7 0 0 1 10 -28.3 Z"
            fill="#FFF3C4"
            stroke="#E6CF86"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
```

Crie `components/hero/camadas/Arco.tsx`:

```tsx
import { ARCOS, amostrarArco, dDoArco, marcasDeHora } from "../geometria";
import { Camada } from "./Camada";

/** O caminho pontilhado do sol, que se desenha com o scroll, e as marcas de hora que ficam depois que o sol passa. */
export function Arco() {
  const d = dDoArco(ARCOS.paisagem);
  return (
    <Camada id="hero-arco">
      <defs>
        <mask id="hero-mascara-arco" maskUnits="userSpaceOnUse" x="-400" y="-600" width="2400" height="1800">
          <path
            id="hero-arco-mascara"
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth="24"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset="1"
          />
        </mask>
      </defs>
      <g mask="url(#hero-mascara-arco)" fill="none" strokeLinecap="round">
        <path className="hero__arco" d={d} stroke="#0E3557" strokeWidth="11" strokeDasharray="0 24" />
        <path className="hero__arco" d={d} stroke="#FFD23F" strokeWidth="6" strokeDasharray="0 24" />
      </g>
      <g className="hero__horas" fontSize="16" fontWeight="500" textAnchor="middle">
        {marcasDeHora(amostrarArco(ARCOS.paisagem)).map((m) => (
          <g key={m.texto} className="hero__hora" data-t={m.t} transform={`translate(${m.x} ${m.y})`} opacity="0">
            <rect x="-36" y="-15" width="72" height="30" rx="15" fill="#FFFFFF" stroke="#0E3557" strokeWidth="2.5" />
            <text y="6" fill="#0E3557">
              {m.texto}
            </text>
          </g>
        ))}
      </g>
    </Camada>
  );
}
```

Crie `components/hero/camadas/Sol.tsx`:

```tsx
import { RAIOS } from "../geometria";

/** O sol: halo, raios que giram e disco. Sem rosto (decisão da spec). */
export function Sol() {
  return (
    <div className="hero__sol" id="hero-sol" aria-hidden="true">
      <svg viewBox="-220 -220 440 440">
        <g fill="#FFE9A3">
          <circle r="214" opacity=".1" />
          <circle r="168" opacity=".16" />
          <circle r="124" opacity=".24" />
        </g>
      </svg>
      <div className="hero__raios">
        <svg viewBox="-220 -220 440 440">
          {RAIOS.map((r) => (
            <path
              key={r.rotacao}
              d={r.d}
              transform={`rotate(${r.rotacao})`}
              fill="#FFC21A"
              stroke="#E08A00"
              strokeWidth="5"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
      <svg viewBox="-220 -220 440 440">
        <circle r="80" fill="#FFD23F" stroke="#E08A00" strokeWidth="6" />
        <circle r="60" fill="#FFE27A" />
        <path d="M-50 -30 A58 58 0 0 1 -14 -56" fill="none" stroke="#FFF8DC" strokeWidth="10" strokeLinecap="round" />
        <circle cx="34" cy="30" r="6" fill="#FFF8DC" opacity=".8" />
      </svg>
    </div>
  );
}
```

Crie `components/hero/camadas/Nuvens.tsx`:

```tsx
const NUVEM =
  "M26 82 C8 82 2 64 14 56 C10 40 28 30 42 38 C46 18 70 10 86 22 C98 6 128 6 138 24 C156 16 178 28 174 46 C192 48 198 68 186 78 C182 82 178 82 172 82 Z";

/** Nuvens fofas, com um tom quente no nascer do sol (--quente). */
export function Nuvens() {
  return (
    <div className="hero__nuvens" id="hero-nuvens" aria-hidden="true">
      {(["n1", "n2", "n3"] as const).map((n) => (
        <svg key={n} className={`hero__nuvem hero__nuvem--${n}`} viewBox="-6 -6 212 100">
          <path d={NUVEM} fill="#FFFFFF" />
          <path className="hero__nuvem-quente" d={NUVEM} fill="#FFCFAE" />
          <path
            d="M12 64 C40 76 90 70 120 76 C150 82 172 72 192 64 C194 76 186 82 172 82 L26 82 C14 82 8 74 12 64 Z"
            fill="#D7ECFA"
          />
          <path d={NUVEM} fill="none" stroke="#2E6FA3" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}
```

Crie `components/hero/camadas/Ave.tsx`:

```tsx
/** O tuiuiú, ave do Pantanal, que atravessa o céu entre a madrugada e a manhã. Elemento de Cuiabá. */
export function Ave() {
  return (
    <div className="hero__ave" id="hero-ave" aria-hidden="true">
      <svg viewBox="-110 -90 240 130">
        <g transform="translate(-6 -6)">
          <path
            className="hero__asa hero__asa--longe"
            d="M0 0 C-10 -30 -30 -52 -58 -64 C-52 -56 -56 -52 -46 -48 C-50 -42 -52 -40 -42 -36 C-40 -22 -32 -8 -26 0 Z"
            fill="#DCE7EE"
            stroke="#0E3557"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        <path d="M-30 6 L-98 12 M-30 10 L-96 20" stroke="#1B2230" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path
          d="M-34 -4 C-50 -4 -56 4 -46 10 C-40 12 -34 8 -30 6 Z"
          fill="#FFFFFF"
          stroke="#0E3557"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="2" rx="38" ry="14" fill="#FFFFFF" stroke="#0E3557" strokeWidth="3" />
        <path d="M28 -2 C40 -8 52 -11 64 -11" stroke="#1B2230" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M27 -1 C31 -3 35 -4 39 -6" stroke="#E0413A" strokeWidth="12" fill="none" strokeLinecap="round" />
        <circle cx="66" cy="-12" r="8.5" fill="#1B2230" />
        <path
          d="M71 -16 C86 -18 102 -21 118 -26 C106 -14 90 -9 72 -7 Z"
          fill="#2B303B"
          stroke="#1B2230"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="68.5" cy="-14.5" r="1.8" fill="#FFFFFF" />
        <g transform="translate(6 -4)">
          <path
            className="hero__asa hero__asa--perto"
            d="M0 0 C-12 -36 -38 -64 -72 -80 C-64 -70 -68 -66 -56 -62 C-62 -56 -62 -52 -50 -48 C-54 -42 -54 -40 -44 -36 C-42 -22 -36 -8 -30 0 Z"
            fill="#FFFFFF"
            stroke="#0E3557"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
```

- [ ] **Passo 6: A paisagem (longe, meio, perto e frente)**

Crie `components/hero/camadas/Longe.tsx`:

```tsx
import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Longe: a serra e a Chapada dos Guimarães com a cachoeira. Elemento de Cuiabá. */
export function Longe() {
  return (
    <Camada id="hero-longe" paralaxe={PARALAXE.longe}>
      <g strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M820 650 C880 610 940 596 1010 598 C1070 600 1100 578 1160 572 C1230 566 1270 584 1340 580 C1410 576 1450 552 1520 552 C1570 552 1610 562 1660 568 L1660 960 L820 960 Z"
          fill="#B9DFD0"
          stroke="#5E9092"
          strokeWidth="3"
        />
        <g transform="translate(0 36)">
          <path
            d="M60 660 L96 548 Q102 528 122 526 L470 518 Q492 518 498 538 L520 600 L590 604 Q604 604 610 592 L628 560 Q636 548 652 548 L748 548 Q764 548 770 562 L812 660 Z"
            fill="#EC9F72"
            stroke="#8E5B4A"
            strokeWidth="3"
          />
          <path
            d="M470 518 Q492 518 498 538 L520 600 L502 600 L480 538 Z M748 548 Q764 548 770 562 L812 660 L792 660 L754 564 Z"
            fill="#D9845A"
          />
          <path
            d="M108 566 Q300 556 490 560 M98 598 Q300 590 512 596 M88 632 Q320 624 560 632 M640 590 Q700 584 770 588 M630 622 Q700 616 790 624"
            fill="none"
            stroke="#D07A50"
            strokeWidth="3"
            strokeDasharray="130 22 70 30"
          />
          <path
            d="M96 548 Q100 522 124 520 L470 512 Q494 512 500 532 L502 540 C494 552 480 552 474 544 C466 556 448 556 442 546 C432 558 414 558 408 548 C398 560 380 560 374 550 C362 560 346 560 340 550 L322 550 C314 560 298 560 292 550 C282 560 266 560 260 550 C250 560 232 560 226 550 C216 560 200 560 194 550 C184 560 166 560 160 550 C150 560 132 560 126 550 C116 560 100 558 96 548 Z"
            fill="#93CC98"
            stroke="#5E8F6A"
            strokeWidth="3"
          />
          <path
            d="M626 566 Q632 548 652 546 L748 546 Q766 546 772 562 L774 570 C766 580 752 580 746 572 C738 582 722 582 716 572 C706 582 690 582 684 572 C674 582 658 582 652 572 C644 582 630 580 626 566 Z"
            fill="#93CC98"
            stroke="#5E8F6A"
            strokeWidth="3"
          />
          <g fill="none">
            <path d="M331 546 C330 570 333 596 334 618" stroke="#5E9092" strokeWidth="18" />
            <path d="M331 546 C330 570 333 596 334 618" stroke="#DDF4FF" strokeWidth="12" />
            <path className="hero__cascata" d="M331 546 C330 570 333 596 334 618" stroke="#FFFFFF" strokeWidth="4" />
          </g>
          <g fill="#FFFFFF" stroke="#5E9092" strokeWidth="2.5">
            <circle cx="322" cy="618" r="9" />
            <circle cx="337" cy="622" r="11" />
            <circle cx="351" cy="617" r="8" />
          </g>
        </g>
      </g>
    </Camada>
  );
}
```

Crie `components/hero/camadas/Meio.tsx`:

```tsx
import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Meio: morros com árvores do cerrado. */
export function Meio() {
  return (
    <Camada id="hero-meio" paralaxe={PARALAXE.meio}>
      <g stroke="#2E6A5C" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M-40 670 C80 652 200 650 330 660 C460 668 560 646 700 640 C840 634 940 650 1060 648 C1180 646 1290 632 1420 634 C1520 636 1580 644 1660 640 L1660 960 L-40 960Z"
          fill="#78BE8C"
        />
        <g fill="none" stroke="#5E4A3A" strokeWidth="5">
          <path d="M196 660 v-24" />
          <path d="M1556 646 v-24" />
        </g>
        <g fill="#4E9E6A">
          <circle cx="196" cy="630" r="16" />
          <circle cx="1556" cy="618" r="17" />
        </g>
      </g>
    </Camada>
  );
}
```

Crie `components/hero/camadas/Ipe.tsx`:

```tsx
import type { CSSProperties } from "react";
import { PETALAS } from "../geometria";
import { COPA, bolinhas, type Circulos } from "./formas";

const SOMBRA: Circulos = [
  [826, 604, 34],
  [868, 618, 34],
  [930, 622, 34],
  [846, 562, 16],
  [890, 524, 14],
];
const LUZ: Circulos = [
  [960, 468, 24],
  [1006, 528, 20],
  [1032, 570, 12],
  [916, 460, 14],
];
const BRILHOS: Circulos = [
  [884, 520, 7],
  [930, 498, 6],
  [962, 540, 7],
  [858, 552, 5],
  [904, 470, 6],
  [1000, 556, 5],
  [920, 546, 4.5],
  [976, 500, 4.5],
  [1014, 586, 4],
];
const MIOLOS: Circulos = [
  [872, 584, 4],
  [944, 572, 4],
  [836, 610, 3.5],
  [990, 578, 3.5],
];

/** O ipê-amarelo florido, com as flores caindo. Elemento de Cuiabá (e o nome da marca). */
export function Ipe() {
  return (
    <g id="hero-ipe">
      <use href="#hero-galhos" stroke="#0E3557" strokeWidth="20" />
      <use href="#hero-galhos" stroke="#8A5A3A" strokeWidth="11" />
      <g fill="#0E3557" strokeWidth="10">
        {bolinhas(COPA)}
      </g>
      <g stroke="none">
        <g fill="#F5B800">{bolinhas(COPA)}</g>
        <g clipPath="url(#hero-copa)">
          <g fill="#E39E00">{bolinhas(SOMBRA)}</g>
          <g fill="#FFD65A">{bolinhas(LUZ)}</g>
        </g>
        <g fill="#FFF0A8">{bolinhas(BRILHOS)}</g>
        <g fill="#F08C1A">{bolinhas(MIOLOS)}</g>
      </g>
      <g fill="#F5B800" strokeWidth="1.5">
        {PETALAS.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path
              className="hero__petala"
              d="M0 0 C5 -6 11 -2 9 4 C7 9 1 8 0 0Z"
              style={{ "--d": `${p.duracao}s`, "--atraso": `${p.atraso}s`, "--vx": `${p.vx}px` } as CSSProperties}
            />
          </g>
        ))}
      </g>
    </g>
  );
}
```

Crie `components/hero/camadas/Casa.tsx`:

```tsx
import { PLACAS, arred } from "../geometria";

/** As oito placas do telhado. O motor acende cada uma, com um pulinho, o reflexo e a faísca. */
function Placas() {
  return (
    <g id="hero-placas">
      {PLACAS.map((p) => (
        <g key={p.id} className="hero__placa" data-placa={p.ordem}>
          <polygon points={p.quad} fill="#1D4E89" stroke="none" />
          <path d={p.celulas} stroke="#3A6CA8" strokeWidth="2.5" fill="none" />
          <g className="hero__placa-luz" data-placa-luz={p.ordem} opacity="0">
            <polygon points={p.quad} fill="#4FB6EE" stroke="none" />
            <path d={p.celulas} stroke="#A8E2FC" strokeWidth="2.5" fill="none" />
          </g>
          <g clipPath={`url(#hero-${p.id})`}>
            <polygon
              data-placa-faixa={p.ordem}
              points={p.faixa}
              transform={`translate(${arred(-0.85 * p.largura)} 0)`}
              fill="#F2FBFF"
              stroke="none"
              opacity="0.9"
            />
          </g>
          <polygon points={p.quad} fill="none" strokeWidth="4" />
        </g>
      ))}
      {PLACAS.map((p) => (
        <use
          key={p.id}
          data-placa-faisca={p.ordem}
          href="#hero-estrelinha"
          fill="#FFF6D6"
          strokeWidth="3"
          opacity="0"
        />
      ))}
    </g>
  );
}

/** A casa com as placas no telhado, as janelas que acendem e o ar-condicionado ligado. */
export function Casa() {
  return (
    <g id="hero-casa">
      <polygon points="1392,604 1432,496 1472,580 1472,700 1392,724" fill="#F6DDB0" />
      <rect x="1108" y="604" width="284" height="120" fill="#FFF3DC" />
      <path d="M1112 619 H1388" stroke="#EAD3AA" strokeWidth="10" />
      <rect x="1104" y="708" width="292" height="16" fill="#EBD3A6" />
      <polygon points="1430,494 1452,494 1496,586 1474,586" fill="#C4502A" />
      <polygon points="1090,606 1410,606 1450,498 1130,498" fill="#E2683C" />
      <path d="M1100 597 H1414 M1134 503 H1446" stroke="#C4502A" strokeWidth="3" fill="none" />
      <Placas />
      <rect x="1084" y="602" width="332" height="12" rx="4" fill="#C4502A" />
      <g fill="#3FA2DB" strokeWidth="3.5">
        <rect x="1118" y="630" width="14" height="52" rx="3" />
        <rect x="1192" y="630" width="14" height="52" rx="3" />
        <rect x="1286" y="630" width="14" height="52" rx="3" />
        <rect x="1360" y="630" width="14" height="52" rx="3" />
      </g>
      <g fill="#2C4A6B">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <g id="hero-janelas" opacity="0" fill="#FFD45C" stroke="none">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <path d="M1162 632 V680 M1134 656 H1190 M1330 632 V680 M1302 656 H1358" stroke="#FFF3DC" strokeWidth="4" fill="none" />
      <g fill="none">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <g fill="#EBD3A6" strokeWidth="3.5">
        <rect x="1124" y="681" width="76" height="9" rx="3" />
        <rect x="1292" y="681" width="76" height="9" rx="3" />
      </g>
      <rect x="1226" y="640" width="48" height="84" rx="8" fill="#8B5A3C" />
      <path d="M1236 652 h28 v26 h-28z M1236 688 h28 v26 h-28z" fill="none" stroke="#6E4630" strokeWidth="3" />
      <circle cx="1265" cy="684" r="4" fill="#FFD23F" strokeWidth="2.5" />
      <rect x="1216" y="720" width="68" height="8" rx="3" fill="#E2CDA3" />
      <polygon points="1406,618 1450,605 1450,635 1406,648" fill="#F4F7FA" strokeWidth="4" />
      <path d="M1412 627 L1444 617 M1412 634 L1444 624 M1412 641 L1444 631" stroke="#A9B6C2" strokeWidth="2.5" />
      <g id="hero-vento" opacity="0" fill="none" stroke="#5CC2F2" strokeWidth="4">
        <path className="hero__vento" d="M1458 612 C1474 606 1486 614 1502 606" />
        <path className="hero__vento" d="M1458 626 C1476 620 1488 630 1508 622" />
        <path className="hero__vento" d="M1458 640 C1472 636 1484 644 1498 638" />
      </g>
      <g fill="#0E3557" strokeWidth="9">
        <circle cx="1150" cy="716" r="13" />
        <circle cx="1166" cy="709" r="16" />
        <circle cx="1182" cy="716" r="12" />
        <circle cx="1374" cy="716" r="12" />
        <circle cx="1390" cy="709" r="15" />
        <circle cx="1406" cy="716" r="11" />
      </g>
      <g fill="#4FA36B" stroke="none">
        <circle cx="1150" cy="716" r="13" />
        <circle cx="1166" cy="709" r="16" />
        <circle cx="1182" cy="716" r="12" />
        <circle cx="1374" cy="716" r="12" />
        <circle cx="1390" cy="709" r="15" />
        <circle cx="1406" cy="716" r="11" />
      </g>
      <g fill="#FFFFFF" stroke="none">
        <circle cx="1158" cy="704" r="2.6" />
        <circle cx="1172" cy="714" r="2.6" />
        <circle cx="1144" cy="716" r="2.2" />
        <circle cx="1384" cy="704" r="2.6" />
        <circle cx="1398" cy="714" r="2.6" />
      </g>
    </g>
  );
}
```

Crie `components/hero/camadas/Perto.tsx`:

```tsx
import { PARALAXE, PLACAS } from "../geometria";
import { Camada } from "./Camada";
import { Casa } from "./Casa";
import { COPA, bolinhas, type Circulos } from "./formas";
import { Ipe } from "./Ipe";

/** O tapete amarelo de flores caídas embaixo do ipê. */
const FLORES_CAIDAS: Circulos = [
  [862, 728, 5],
  [884, 734, 4],
  [902, 726, 5],
  [944, 732, 5],
  [968, 726, 4],
  [988, 734, 5],
  [846, 736, 3.5],
  [1004, 728, 3.5],
  [926, 738, 4],
];

/** Perto: o chão, o ipê, a casa, o relógio de luz e o fio com a energia correndo. */
export function Perto() {
  return (
    <Camada id="hero-perto" paralaxe={PARALAXE.perto}>
      <defs>
        <clipPath id="hero-copa">{bolinhas(COPA)}</clipPath>
        <path
          id="hero-galhos"
          fill="none"
          d="M920 722 C916 690 926 662 914 628 C908 610 912 596 906 578 M914 640 C896 622 874 610 852 600 M916 630 C940 612 962 600 990 590 M908 596 C900 576 902 560 896 546 M912 606 C930 590 944 572 950 554"
        />
        <path
          id="hero-estrelinha"
          d="M0 -16 C2 -4 4 -2 16 0 C4 2 2 4 0 16 C-2 4 -4 2 -16 0 C-4 -2 -2 -4 0 -16Z"
        />
        {PLACAS.map((p) => (
          <clipPath key={p.id} id={`hero-${p.id}`}>
            <polygon points={p.quad} />
          </clipPath>
        ))}
      </defs>
      <g stroke="#0E3557" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M-40 716 C180 700 400 712 620 706 C860 700 1060 694 1300 700 C1460 704 1560 700 1660 696 L1660 960 L-40 960Z"
          fill="#5DB574"
        />
        <path
          d="M-40 828 C300 808 700 820 1000 814 C1300 808 1500 820 1660 814 L1660 960 L-40 960Z"
          fill="#56AE6D"
          stroke="none"
        />
        <g fill="none" stroke="#3B8A55" strokeWidth="4">
          <path d="M120 772 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M430 812 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M690 764 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M980 852 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M1380 790 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M560 870 l8 -14 l6 12 l8 -16 l6 14" />
        </g>
        <ellipse id="hero-sombra-ipe" cx="920" cy="724" rx="70" ry="10" fill="#4A9D62" stroke="none" />
        <ellipse id="hero-sombra-casa" cx="1290" cy="728" rx="230" ry="12" fill="#4A9D62" stroke="none" />
        <path
          d="M1228 726 C1226 760 1196 790 1160 818 C1120 850 1096 880 1084 930 L1300 930 C1300 884 1310 846 1296 806 C1286 776 1276 750 1274 726 Z"
          fill="#EFCF95"
        />
        <g fill="#DDB677" stroke="none">
          <ellipse cx="1206" cy="826" rx="11" ry="5" />
          <ellipse cx="1262" cy="866" rx="13" ry="6" />
          <ellipse cx="1150" cy="892" rx="10" ry="5" />
          <ellipse cx="1272" cy="786" rx="8" ry="4" />
          <ellipse cx="1240" cy="756" rx="7" ry="3" />
        </g>
        <g fill="#F5B800" stroke="none">
          {bolinhas(FLORES_CAIDAS)}
        </g>
        <Ipe />
        <rect x="1050" y="640" width="16" height="84" rx="4" fill="#C9A879" />
        <path d="M1026 606 Q1058 584 1090 606 Z" fill="#9AA8B5" />
        <rect x="1032" y="602" width="52" height="50" rx="10" fill="#F2F5F8" />
        <circle cx="1058" cy="626" r="15" fill="#FFFFFF" strokeWidth="3.5" />
        <path id="hero-ponteiro" d="M1058 626 V614" stroke="#E2683C" strokeWidth="4" />
        <circle cx="1058" cy="626" r="3" fill="#0E3557" stroke="none" />
        <Casa />
        <path d="M1114 612 V694 H1066" fill="none" strokeWidth="9" />
        <path d="M1114 612 V694 H1066" fill="none" stroke="#9AA8B5" strokeWidth="4" />
        <path
          id="hero-fluxo"
          className="hero__fluxo"
          d="M1114 612 V694 H1058 V652"
          fill="none"
          stroke="#FFD23F"
          strokeWidth="7"
          opacity="0"
        />
      </g>
    </Camada>
  );
}
```

Crie `components/hero/camadas/Frente.tsx`:

```tsx
import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Frente: o capim que entra pelas bordas, com uma flor de ipê. */
export function Frente() {
  return (
    <Camada id="hero-frente" paralaxe={PARALAXE.frente}>
      <g stroke="#0E3557" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M110 940 C116 870 104 828 76 796 C120 818 146 866 148 940 Z" fill="#3E9A5C" />
        <path d="M146 940 C152 862 166 812 204 776 C190 826 182 878 184 940 Z" fill="#4CAF6A" />
        <path d="M184 940 C190 886 214 852 252 834 C232 862 222 894 222 940 Z" fill="#3E9A5C" />
        <path d="M222 940 C228 898 248 878 282 866 C262 888 256 910 258 940 Z" fill="#4CAF6A" />
        <path d="M166 940 C168 880 176 846 192 818" fill="none" />
        <g transform="translate(194 812)">
          <g fill="#F5B800">
            <ellipse cx="0" cy="-11" rx="6" ry="10" />
            <ellipse cx="0" cy="11" rx="6" ry="10" />
            <ellipse cx="-11" cy="0" rx="10" ry="6" />
            <ellipse cx="11" cy="0" rx="10" ry="6" />
          </g>
          <circle r="6" fill="#0E3557" />
        </g>
        <path d="M1600 940 C1594 870 1606 828 1634 796 C1590 818 1564 866 1562 940 Z" fill="#3E9A5C" />
        <path d="M1564 940 C1558 862 1544 812 1506 776 C1520 826 1528 878 1526 940 Z" fill="#4CAF6A" />
        <path d="M1526 940 C1520 886 1496 852 1458 834 C1478 862 1488 894 1488 940 Z" fill="#3E9A5C" />
        <path d="M1488 940 C1482 898 1462 878 1428 866 C1448 888 1454 910 1452 940 Z" fill="#4CAF6A" />
      </g>
    </Camada>
  );
}
```

- [ ] **Passo 7: As faixas de texto e o hero**

Crie `components/hero/Faixa.tsx`:

```tsx
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { FaixaHero } from "@/content/tipos";
import { dividirEmPalavras, textoCorrido } from "./geometria";

type Props = { indice: number; faixa: FaixaHero; titulo?: "h1" | "p"; id?: string; children?: ReactNode };

/** Uma faixa de texto do hero. O título vai inteiro para o leitor de tela e em palavras para a montagem. */
export function Faixa({ indice, faixa, titulo: Titulo = "p", id, children }: Props) {
  const classes = [
    "hero__faixa",
    `hero__faixa--${indice + 1}`,
    indice === 0 ? "hero__faixa--escura" : "hero__faixa--clara",
    indice === 2 ? "hero__faixa--final" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} data-faixa={indice}>
      <Titulo className="hero__titulo" id={id}>
        <span className="hero__rotulo">{faixa.rotulo}</span>
        <span className="sr-only">{textoCorrido(faixa.titulo)}</span>
        <span className="hero__frase" aria-hidden="true">
          {dividirEmPalavras(faixa.titulo).map((palavra) => (
            <Fragment key={palavra.i}>
              {palavra.i > 0 && " "}
              <span className="hero__palavra" style={{ "--i": palavra.i } as CSSProperties}>
                {palavra.partes.map((parte, j) => (parte.destaque ? <em key={j}>{parte.texto}</em> : parte.texto))}
              </span>
            </Fragment>
          ))}
        </span>
      </Titulo>
      <p className="hero__apoio">{faixa.apoio}</p>
      {children}
    </div>
  );
}
```

Crie `components/hero/Hero.tsx`:

```tsx
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { inicio } from "@/content/inicio";
import { Arco } from "./camadas/Arco";
import { Ave } from "./camadas/Ave";
import { Ceu } from "./camadas/Ceu";
import { Frente } from "./camadas/Frente";
import { Longe } from "./camadas/Longe";
import { Meio } from "./camadas/Meio";
import { Nuvens } from "./camadas/Nuvens";
import { Perto } from "./camadas/Perto";
import { Sol } from "./camadas/Sol";
import { Faixa } from "./Faixa";

const t = inicio.hero;

/** Hero da Início: o dia em Cuiabá, da madrugada ao meio-dia, guiado pelo scroll. Todo o desenho sai pronto do servidor. */
export function Hero() {
  const [madrugada, manha, meioDia] = t.faixas;
  return (
    <section className="hero" id="hero" aria-labelledby="hero-titulo">
      <div className="hero__palco" id="hero-palco">
        <div className="hero__cena">
          <Ceu />
          <Arco />
          <Sol />
          <Nuvens />
          <Ave />
          <Longe />
          <Meio />
          <Perto />
          <Frente />
          <div className="hero__sombra-noite" id="hero-sombra-noite" aria-hidden="true" />
          <div className="hero__brilho-nascer" id="hero-brilho-nascer" aria-hidden="true" />
        </div>
        <div className="hero__faixas">
          <Faixa indice={0} faixa={madrugada} titulo="h1" id="hero-titulo" />
          <Faixa indice={1} faixa={manha} />
          <Faixa indice={2} faixa={meioDia}>
            <div className="hero__acoes">
              <LinkWhatsapp className="botao botao--ipe">{t.botaoOrcamento}</LinkWhatsapp>
              <a className="hero__link" href="#simulador">
                {t.botaoSimular}
              </a>
            </div>
          </Faixa>
        </div>
        <div className="hero__painel" aria-hidden="true">
          <div className="hero__painel-linha">
            <small>{t.painel.lugar}</small>
            <strong id="hero-hora">05:40</strong>
          </div>
          <div className="hero__painel-linha">
            <small>{t.painel.gerando}</small>
            <strong id="hero-kw">0,0 kW</strong>
          </div>
          <div className="hero__painel-barra">
            <i id="hero-barra" />
          </div>
        </div>
        <div className="hero__dica" id="hero-dica" aria-hidden="true">
          {t.dica}
          <i />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Passo 8: O CSS do hero**

Crie `components/hero/hero.css`, portado do protótipo v4 com os nomes novos:

```css
/* Hero da Início: o dia em Cuiabá guiado pelo scroll (port do protótipo v4).
   Por quadro, só transform, opacity e atributos de elementos pequenos mudam. Nada de filter animado. */
@layer components {
  .hero {
    position: relative;
    height: 450vh;
  }
  .hero__palco {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    isolation: isolate;
    contain: layout paint;
    background: #06152b;
  }
  .hero__cena,
  .hero__faixas {
    position: absolute;
    inset: 0;
  }
  .hero__cena {
    transition: opacity 0.3s var(--ease-saida);
  }
  .hero__cena > * {
    position: absolute;
  }
  .hero__ceu,
  .hero__noite,
  .hero__brilho-nascer,
  .hero__sombra-noite,
  .hero__nuvens,
  .hero__camada {
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* céu: quatro momentos que se misturam só por opacidade */
  .hero__ceu--madrugada {
    background: linear-gradient(180deg, #06152b 0%, #0b2a4f 45%, #22406f 68%, #4e4c7a 84%, #8a5a72 100%);
  }
  .hero__ceu--nascer {
    opacity: 0;
    background: linear-gradient(180deg, #0f2a58 0%, #1d3f78 44%, #5b5a92 62%, #e0866f 80%, #ffc07a 100%);
  }
  .hero__ceu--manha {
    opacity: 0;
    background: linear-gradient(180deg, #3fa2db 0%, #5db7e8 30%, #9ad4f3 62%, #d9f0fa 84%, #fff0c8 100%);
  }
  .hero__ceu--dia {
    opacity: 0;
    background: linear-gradient(180deg, #8acff5 0%, #b5e2f9 45%, #dcf1fb 80%, #f1f9fd 100%);
  }
  .hero__brilho-nascer {
    opacity: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse 60% 50% at 96% 66%,
      rgb(255 190 120 / 0.55) 0%,
      rgb(255 150 100 / 0.22) 42%,
      rgb(255 150 100 / 0) 74%
    );
  }
  .hero__sombra-noite {
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgb(7 26 51 / 0) var(--n0, 46%),
      rgb(7 26 51 / 0.62) var(--n1, 74%),
      rgb(7 26 51 / 0.7) 100%
    );
  }
  .hero__noite {
    pointer-events: none;
    background:
      radial-gradient(1.5px 1.5px at 12% 18%, #fff 98%, transparent),
      radial-gradient(1px 1px at 24% 8%, #fff 98%, transparent),
      radial-gradient(1.5px 1.5px at 41% 22%, #fff 98%, transparent),
      radial-gradient(1px 1px at 52% 6%, #fff 98%, transparent),
      radial-gradient(1.5px 1.5px at 66% 28%, #fff 98%, transparent),
      radial-gradient(1px 1px at 78% 10%, #fff 98%, transparent),
      radial-gradient(1px 1px at 90% 21%, #fff 98%, transparent),
      radial-gradient(1px 1px at 4% 40%, #fff 98%, transparent),
      radial-gradient(1.5px 1.5px at 34% 38%, #fff 98%, transparent),
      radial-gradient(1px 1px at 60% 42%, #fff 98%, transparent),
      radial-gradient(1px 1px at 82% 36%, #fff 98%, transparent),
      radial-gradient(1px 1px at 47% 47%, #fff 98%, transparent);
  }
  .hero__estrela {
    position: absolute;
    width: 16px;
    height: 16px;
    animation: hero-cintilar 3.4s var(--ease-meio) infinite;
  }
  .hero__lua {
    position: absolute;
    left: 44%;
    top: 9%;
    width: 58px;
    height: 58px;
  }

  /* camadas em SVG */
  .hero__camada {
    display: block;
    overflow: visible;
    pointer-events: none;
  }
  .hero__paisagem {
    will-change: transform;
  }
  .hero__horas {
    font-family: var(--font-mono);
  }

  /* sol, nuvens e tuiuiú */
  .hero__sol {
    left: 0;
    top: 0;
    width: 440px;
    height: 440px;
    will-change: transform;
    pointer-events: none;
  }
  .hero__sol > * {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hero__raios {
    animation: hero-girar 70s linear infinite;
  }
  .hero__nuvens {
    opacity: 0;
    pointer-events: none;
  }
  .hero__nuvem {
    position: absolute;
    height: auto;
    overflow: visible;
    animation: hero-vagar 30s var(--ease-meio) infinite alternate;
  }
  .hero__nuvem--n1 {
    left: 50%;
    top: 9%;
    width: clamp(120px, 12vw, 180px);
  }
  .hero__nuvem--n2 {
    left: 70%;
    top: 33%;
    width: clamp(100px, 10vw, 150px);
    animation-duration: 38s;
    animation-direction: alternate-reverse;
  }
  .hero__nuvem--n3 {
    left: 1%;
    top: 47%;
    width: clamp(90px, 8vw, 124px);
    animation-duration: 34s;
  }
  .hero__nuvem-quente {
    opacity: var(--quente, 0);
  }
  .hero__ave {
    left: 0;
    top: 0;
    width: 160px;
    visibility: hidden;
    will-change: transform;
    pointer-events: none;
  }
  .hero__ave svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .hero__asa {
    transform-box: fill-box;
    transform-origin: 100% 100%;
    animation: hero-bater 0.75s var(--ease-meio) infinite;
  }
  .hero__asa--longe {
    animation-delay: -0.1s;
  }
  .hero__ave:not(.hero__ave--voando) .hero__asa {
    animation-play-state: paused;
  }

  /* traços pequenos que correm (herdados do protótipo aprovado) e as flores caindo */
  .hero__cascata {
    stroke-dasharray: 12 16;
    animation: hero-correr 1s linear infinite;
  }
  .hero__fluxo {
    stroke-dasharray: 0 18;
    animation: hero-fluir 1.1s linear infinite;
  }
  .hero__vento {
    stroke-dasharray: 14 12;
    animation: hero-soprar 0.9s linear infinite;
  }
  .hero__petala {
    animation: hero-cair var(--d, 9s) linear infinite;
    animation-delay: var(--atraso, 0s);
  }

  /* fora da tela ou com a aba escondida, nada anima */
  .pausado,
  .pausado * {
    animation-play-state: paused !important;
  }
  body.aba-oculta *,
  body.aba-oculta *::before,
  body.aba-oculta *::after {
    animation-play-state: paused !important;
  }

  /* faixas de texto: a primeira já aparece (é o maior elemento visível) */
  .hero__faixas {
    z-index: 3;
    pointer-events: none;
  }
  .hero__faixa {
    position: absolute;
    left: max(16px, calc((100vw - 1120px) / 2));
    top: clamp(96px, 19vh, 190px);
    opacity: 0;
    will-change: opacity;
  }
  .hero__faixa--1 {
    opacity: 1;
  }
  .hero__faixa--final {
    pointer-events: auto;
  }
  /* quem chega pelo teclado num link escondido vê a faixa dele */
  .hero__faixa:focus-within {
    opacity: 1 !important;
  }
  .hero__faixa--escura {
    color: var(--color-papel);
  }
  .hero__faixa--clara {
    color: var(--color-profundo);
  }
  .hero__rotulo {
    display: block;
    margin-bottom: 18px;
    font: 500 0.78rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .hero__titulo {
    max-width: 13ch;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.4rem, 6.2vw, 5.2rem);
    line-height: 0.98;
    letter-spacing: -0.025em;
  }
  .hero__faixa--final .hero__titulo {
    max-width: 14ch;
  }
  .hero__titulo em {
    font-style: normal;
  }
  .hero__faixa--escura .hero__titulo em {
    color: var(--color-ipe);
  }
  .hero__faixa--clara .hero__titulo em {
    margin: 0 -0.05em;
    padding: 0 0.05em;
    background: linear-gradient(var(--color-ipe), var(--color-ipe)) no-repeat 0 90% / calc(var(--k, 1) * 100%) 0.3em;
  }
  .hero__palavra {
    display: inline-block;
    transform: translateY(calc(max(0, 1 - (var(--k, 1) - var(--i, 0) * 0.05) * 2.5) * 0.45em));
    opacity: calc((var(--k, 1) - var(--i, 0) * 0.05) * 4);
  }
  .hero__faixa--1 .hero__palavra {
    animation: hero-montar 0.9s var(--ease-saida) both;
    animation-delay: calc(0.15s + var(--i) * 0.07s);
  }
  .hero__apoio {
    max-width: 34ch;
    margin-top: 18px;
    font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  }
  .hero__acoes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 22px;
    margin-top: 28px;
  }
  .hero__link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-weight: 600;
    text-underline-offset: 4px;
  }

  /* painel de hora e geração, e a dica de rolar */
  .hero__painel {
    position: absolute;
    right: max(16px, calc((100vw - 1120px) / 2));
    bottom: 22px;
    z-index: 3;
    min-width: 206px;
    padding: 12px 16px 14px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 16px;
    background: rgb(8 30 54 / 0.86);
    color: var(--color-papel);
    font-family: var(--font-mono);
    box-shadow: 0 5px 0 rgb(6 20 40 / 0.35);
  }
  .hero__painel-linha {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 18px;
  }
  .hero__painel-linha + .hero__painel-linha {
    margin-top: 4px;
  }
  .hero__painel small {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.75;
  }
  .hero__painel strong {
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  .hero__painel-barra {
    height: 6px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 3px;
    background: rgb(255 255 255 / 0.14);
  }
  .hero__painel-barra i {
    display: block;
    height: 100%;
    background: var(--color-ipe);
    transform: scaleX(0);
    transform-origin: left;
    will-change: transform;
  }
  .hero__dica {
    position: absolute;
    left: 50%;
    bottom: 22px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transform: translateX(-50%);
    color: var(--color-papel);
    font: 500 0.75rem/1 var(--font-mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .hero__dica i {
    width: 1px;
    height: 34px;
    background: linear-gradient(var(--color-papel), transparent);
    animation: hero-respirar 2.4s var(--ease-meio) infinite;
  }

  /* celular em pé: a câmera foca a casa e o texto vem para cima */
  @media (max-aspect-ratio: 1/1) {
    .hero__faixa {
      top: clamp(84px, 12vh, 130px);
      right: 16px;
    }
    .hero__titulo {
      font-size: clamp(2.1rem, 9.5vw, 3.4rem);
    }
    .hero__apoio {
      font-size: 1rem;
    }
    .hero__painel {
      left: 12px;
      right: 12px;
      bottom: 10px;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
      padding: 8px 12px;
    }
    .hero__painel-linha {
      gap: 8px;
    }
    .hero__painel-linha + .hero__painel-linha {
      margin-top: 0;
    }
    .hero__painel strong {
      font-size: 0.95rem;
    }
    .hero__painel-barra {
      flex: 1;
      margin-top: 0;
    }
    .hero__dica,
    .hero__horas,
    .hero__nuvem--n3 {
      display: none;
    }
    .hero__lua {
      left: auto;
      right: 9%;
      top: 34%;
    }
    .hero__nuvem--n1 {
      left: 2%;
      top: 55%;
      width: 96px;
    }
    .hero__nuvem--n2 {
      left: 44%;
      top: 61%;
      width: 84px;
    }
    .hero__sombra-noite {
      --n0: 58%;
      --n1: 82%;
    }
  }
  /* celular deitado: pouca altura */
  @media (max-height: 560px) and (min-aspect-ratio: 1/1) {
    .hero__titulo {
      font-size: 2.4rem;
    }
    .hero__apoio,
    .hero__painel {
      display: none;
    }
  }

  /* movimento reduzido: o meio-dia parado numa tela (o motor escreve os mesmos valores) */
  @media (prefers-reduced-motion: reduce) {
    .hero {
      height: auto;
    }
    .hero__palco {
      position: relative;
    }
    .hero__palavra {
      transform: none !important;
      opacity: 1 !important;
    }
    .hero__ceu--dia,
    .hero__faixa--final {
      opacity: 1;
    }
    .hero__faixa--1 {
      opacity: 0;
    }
    .hero__dica {
      display: none;
    }
  }

  /* sem JavaScript: o fim da história, o meio-dia numa tela */
  @media (scripting: none) {
    .hero {
      height: auto;
    }
    .hero__palco {
      position: relative;
    }
    .hero__ceu--dia,
    .hero__nuvens,
    .hero__placa-luz,
    .hero__faixa--final {
      opacity: 1;
    }
    #hero-janelas {
      opacity: 0.92;
    }
    .hero__faixa--1 {
      opacity: 0;
    }
    .hero__sol,
    .hero__ave,
    .hero__noite,
    #hero-arco,
    .hero__sombra-noite,
    .hero__dica,
    .hero__painel {
      display: none;
    }
  }
}

@keyframes hero-cintilar {
  0%,
  100% {
    transform: scale(0.55);
    opacity: 0.45;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes hero-girar {
  to {
    transform: rotate(360deg);
  }
}
@keyframes hero-vagar {
  from {
    transform: translateX(-26px);
  }
  to {
    transform: translateX(26px);
  }
}
@keyframes hero-bater {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(-0.5);
  }
}
@keyframes hero-correr {
  to {
    stroke-dashoffset: -28;
  }
}
@keyframes hero-fluir {
  to {
    stroke-dashoffset: -36;
  }
}
@keyframes hero-soprar {
  to {
    stroke-dashoffset: -26;
  }
}
@keyframes hero-cair {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translate(calc(var(--vx) * 0.5), 110px) rotate(180deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--vx), 230px) rotate(360deg);
    opacity: 0;
  }
}
@keyframes hero-montar {
  from {
    transform: translateY(0.5em);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes hero-respirar {
  0%,
  100% {
    transform: scaleY(0.4);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
}
```

- [ ] **Passo 9: Ligar na Início**

Em `app/globals.css`, acrescente depois do `@import "../components/layout/rodape.css";`:

```css
@import "../components/hero/hero.css";
```

Troque `app/page.tsx` por:

```tsx
import { Hero } from "@/components/hero/Hero";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";

export default function Inicio() {
  return (
    <>
      <Hero />
      <SecaoSimulador />
    </>
  );
}
```

- [ ] **Passo 10: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npm test && npx playwright test tests/e2e/hero.spec.ts tests/e2e/base.spec.ts tests/e2e/barra.spec.ts tests/e2e/simulador.spec.ts`
Esperado:
- PASS em todos;
- a base continua com um H1 só (o do hero), na fonte Bricolage, e sem erros no console;
- o build da bateria de ponta a ponta mostra `/` estática.

- [ ] **Passo 11: Conferir com os próprios olhos**

Com o `npm run dev` rodando, abra http://localhost:3000. O hero aparece na madrugada, parado, porque o motor chega na Tarefa 7. Confira se o desenho bate com o protótipo v4 no estado inicial.

- [ ] **Passo 12: Commit**

```bash
git add components/hero app/page.tsx app/globals.css tests/e2e/hero.spec.ts tests/e2e/base.spec.ts tests/e2e/barra.spec.ts
git commit -m "feat: hero da Início no servidor, com o desenho do protótipo v4

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 7: Motor do hero, estados da barra e botão flutuante

**Arquivos:**
- Criar: `components/hero/MotorDoHero.tsx`
- Modificar:
  - componentes: `components/hero/Hero.tsx`, `components/hero/hero.css`, `components/layout/barra-topo.css`, `components/layout/whatsapp-flutuante.css`;
  - testes: `tests/e2e/whatsapp.spec.ts`, `tests/e2e/geometria.spec.ts`.
- Teste: `tests/e2e/hero.spec.ts`

**Interfaces:**
- Consome: o DOM da Tarefa 6 e a geometria da Tarefa 5.
- Produz:
  - `MotorDoHero()`, componente cliente que devolve `null`;
  - as classes `topo--sobre-claro` e `topo--solida` no `#topo`, `flutuante--visivel` no `#whatsapp-flutuante` e `hero--pronto` no `#hero`;
  - a classe `pausado` no `#hero-palco` e a classe `aba-oculta` no `body`.

- [ ] **Passo 1: Escrever os testes que falham**

Em `tests/e2e/hero.spec.ts`:
- troque a primeira linha por:

  ```ts
  import { expect, test, type Page } from "@playwright/test";

  /** Rola até o progresso p do hero (0 a 1). */
  async function rolar(page: Page, p: number) {
    await page.evaluate((alvo) => {
      const hero = document.getElementById("hero")!;
      scrollTo(0, hero.offsetTop + (hero.offsetHeight - innerHeight) * alvo);
    }, p);
  }
  ```

- acrescente no fim do arquivo:

```ts
test.describe("hero com o motor", () => {
  test("no topo da Início: madrugada, barra transparente e sem botão flutuante", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toHaveClass(/hero--pronto/);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
    const topo = page.locator("#topo");
    await expect(topo).not.toHaveClass(/topo--solida/);
    await expect(topo).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator("#whatsapp-flutuante")).toBeHidden();
  });

  test("no fim do hero: meio-dia, placas acesas e barra com links azuis", async ({ page }) => {
    await page.goto("/");
    await rolar(page, 1);
    await expect(page.locator("#hero-hora")).toHaveText("12:00");
    await expect
      .poll(() => page.locator("[data-placa-luz]").evaluateAll((els) => els.map((el) => el.getAttribute("opacity"))))
      .toEqual(Array(8).fill("1.000"));
    await expect(page.locator("#topo")).toHaveClass(/topo--sobre-claro/);
    await expect(page.locator("#whatsapp-flutuante")).toBeHidden();
  });

  test("depois do hero: barra sólida, botão flutuante visível e cena pausada", async ({ page }) => {
    await page.goto("/");
    await page.locator("#simulador").scrollIntoViewIfNeeded();
    await expect(page.locator("#topo")).toHaveClass(/topo--solida/);
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
    await expect(page.locator("#hero-palco")).toHaveClass(/pausado/);
  });

  test("um link escondido do hero aparece quando recebe o foco do teclado", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hero__faixa--final .hero__link").focus();
    await expect(page.locator(".hero__faixa--final")).toHaveCSS("opacity", "1");
  });

  test("nas outras páginas a barra é sólida e o botão flutuante aparece", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
  });

  test("sair da Início e voltar sem recarregar recomeça o hero", async ({ page, isMobile }) => {
    test.skip(isMobile, "os links do topo ficam no menu do celular");
    await page.goto("/");
    await rolar(page, 0.5);
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/\/sobre$/);
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
    await page.getByRole("banner").getByRole("link", { name: "Ipê Solar" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("no celular em pé, a câmera foca a casa", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await expect(page.locator("#hero-perto")).toHaveAttribute("viewBox", "780 300 750 600");
    const casa = (await page.locator("#hero-casa").boundingBox())!;
    expect(casa.x).toBeGreaterThanOrEqual(0);
    expect(casa.x + casa.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  });

  test("no celular deitado, a cena inteira fica ancorada à direita, com a casa na tela", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.setViewportSize({ width: 812, height: 375 });
    await page.goto("/");
    await expect(page.locator("#hero-perto")).toHaveAttribute("viewBox", "0 0 1600 900");
    const casa = (await page.locator("#hero-casa").boundingBox())!;
    expect(casa.x).toBeGreaterThanOrEqual(0);
    expect(casa.x + casa.width).toBeLessThanOrEqual(812);
  });

  test("rolar o hero não engasga: no máximo 2% de quadros lentos", async ({ page, isMobile, browserName }) => {
    test.skip(isMobile || browserName !== "chromium", "medido só no Chromium do computador");
    await page.goto("/");
    await page.evaluate(() => {
      const quadros: number[] = [];
      (window as unknown as { quadros: number[] }).quadros = quadros;
      let antes = performance.now();
      const medir = (agora: number) => {
        quadros.push(agora - antes);
        antes = agora;
        requestAnimationFrame(medir);
      };
      requestAnimationFrame(medir);
    });
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(500);
    const quadros = await page.evaluate(() => (window as unknown as { quadros: number[] }).quadros.slice(5));
    const lentos = quadros.filter((d) => d > 33).length;
    expect(lentos / quadros.length).toBeLessThanOrEqual(0.02);
  });
});

test.describe("hero com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("uma tela, com o meio-dia parado", async ({ page }) => {
    await page.goto("/");
    const caixa = (await page.locator("#hero").boundingBox())!;
    expect(caixa.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
    await expect(page.locator("#hero-hora")).toHaveText("12:00");
    await expect(page.locator(".hero__faixa--final")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero__faixa--1")).toHaveCSS("opacity", "0");
  });
});

test("trocar o movimento reduzido no meio da visita muda o hero na hora", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero-hora")).toHaveText("05:40");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#hero-hora")).toHaveText("12:00");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#hero-hora")).toHaveText("05:40");
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/hero.spec.ts`
Esperado: FAIL nos testes do motor e do movimento reduzido. Sem o motor, a hora não sai de "05:40", não há `hero--pronto` e o `#topo` continua sólido. Os dois testes da Tarefa 6 continuam passando.

- [ ] **Passo 3: O motor**

Crie `components/hero/MotorDoHero.tsx`, portado do script do protótipo v4:

```tsx
"use client";

import { useEffect } from "react";
import {
  AJUSTE,
  ARCOS,
  FAIXAS,
  PLACAS,
  VIEWBOX,
  amostrarArco,
  clamp,
  dDoArco,
  montagemDaFaixa,
  opacidadeDaFaixa,
  relogio,
  solNoCaminho,
  suave,
  type Orientacao,
  type Ponto,
} from "./geometria";

/** Liga o hero ao scroll. Não desenha nada: só escreve no DOM que o servidor já mandou pronto. */
export function MotorDoHero() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    const palco = document.getElementById("hero-palco");
    if (!hero || !palco) return;
    return ligar(hero, palco);
  }, []);
  return null;
}

type Estilo = "transform" | "visibility" | "pointerEvents";

function ligar(hero: HTMLElement, palco: HTMLElement): () => void {
  const pegar = <T extends Element>(seletor: string): T => {
    const el = hero.querySelector<T>(seletor);
    if (!el) throw new Error(`Hero: ${seletor} não encontrado`);
    return el;
  };
  const todos = <T extends Element>(seletor: string) => [...hero.querySelectorAll<T>(seletor)];

  const camadas = todos<SVGSVGElement>(".hero__camada");
  const paisagens = todos<SVGSVGElement>(".hero__paisagem").map((el) => ({ el, fator: Number(el.dataset.paralaxe) }));
  const sol = pegar<HTMLElement>("#hero-sol");
  const ave = pegar<HTMLElement>("#hero-ave");
  const noite = pegar<HTMLElement>("#hero-noite");
  const lua = pegar<SVGSVGElement>("#hero-lua");
  const nuvens = pegar<HTMLElement>("#hero-nuvens");
  const ceuNascer = pegar<HTMLElement>("#hero-ceu-nascer");
  const ceuManha = pegar<HTMLElement>("#hero-ceu-manha");
  const ceuDia = pegar<HTMLElement>("#hero-ceu-dia");
  const brilho = pegar<HTMLElement>("#hero-brilho-nascer");
  const sombraNoite = pegar<HTMLElement>("#hero-sombra-noite");
  const hora = pegar<HTMLElement>("#hero-hora");
  const kw = pegar<HTMLElement>("#hero-kw");
  const barra = pegar<HTMLElement>("#hero-barra");
  const dica = pegar<HTMLElement>("#hero-dica");
  const sombraIpe = pegar<SVGEllipseElement>("#hero-sombra-ipe");
  const sombraCasa = pegar<SVGEllipseElement>("#hero-sombra-casa");
  const janelas = pegar<SVGGElement>("#hero-janelas");
  const fluxo = pegar<SVGPathElement>("#hero-fluxo");
  const vento = pegar<SVGGElement>("#hero-vento");
  const ponteiro = pegar<SVGPathElement>("#hero-ponteiro");
  const mascara = pegar<SVGPathElement>("#hero-arco-mascara");
  const arcos = todos<SVGPathElement>(".hero__arco");
  const horas = todos<SVGGElement>(".hero__hora").map((g) => ({ g, t: Number(g.dataset.t) }));
  const placas = PLACAS.map((p) => ({
    ...p,
    g: pegar<SVGGElement>(`[data-placa="${p.ordem}"]`),
    luz: pegar<SVGGElement>(`[data-placa-luz="${p.ordem}"]`),
    faixa: pegar<SVGPolygonElement>(`[data-placa-faixa="${p.ordem}"]`),
    faisca: pegar<SVGUseElement>(`[data-placa-faisca="${p.ordem}"]`),
  }));
  const faixas = todos<HTMLElement>("[data-faixa]");
  const faixaFinal = faixas[faixas.length - 1];
  const topo = document.getElementById("topo");
  const flutuante = document.getElementById("whatsapp-flutuante");
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

  // escritas no DOM só quando o valor muda
  const cache = new Map<string, string | number | boolean>();
  const opacidade = (el: HTMLElement | SVGElement, v: number, chave: string) => {
    const r = Math.round(v * 1000) / 1000;
    if (cache.get(chave) === r) return;
    cache.set(chave, r);
    el.style.opacity = String(r);
  };
  const atributo = (el: Element, nome: string, v: string, chave: string) => {
    if (cache.get(chave) === v) return;
    cache.set(chave, v);
    el.setAttribute(nome, v);
  };
  const estilo = (el: HTMLElement | SVGElement, nome: Estilo, v: string, chave: string) => {
    if (cache.get(chave) === v) return;
    cache.set(chave, v);
    el.style[nome] = v;
  };

  // enquadramento: paisagem ancorada à direita (a casa nunca sai); no retrato, a câmera foca casa e ipê
  let retrato: boolean | null = null;
  let amostras: Ponto[] = [];
  let geo = { s: 1, W: 1, vx: 0, vy: 0, ox: 0, oy: 0 };
  const faixasK = faixas.map(() => -1);

  const enquadrar = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const r = W / H < 1;
    const o: Orientacao = r ? "retrato" : "paisagem";
    const [vx, vy, vw, vh] = VIEWBOX[o].split(" ").map(Number) as [number, number, number, number];
    if (r !== retrato) {
      retrato = r;
      for (const c of camadas) {
        c.setAttribute("viewBox", VIEWBOX[o]);
        c.setAttribute("preserveAspectRatio", AJUSTE[o]);
      }
      const d = dDoArco(ARCOS[o]);
      for (const a of arcos) a.setAttribute("d", d);
      mascara.setAttribute("d", d);
      amostras = amostrarArco(ARCOS[o]);
    }
    const s = r ? Math.min(W / vw, H / vh) : Math.max(W / vw, H / vh);
    geo = { s, W, vx, vy, ox: r ? (W - vw * s) / 2 : W - vw * s, oy: H - vh * s };
    sol.style.width = sol.style.height = `${440 * s}px`;
    ave.style.width = `${170 * s}px`;
    cache.clear();
    faixasK.fill(-1);
  };
  const tela = (x: number, y: number): Ponto => [geo.ox + (x - geo.vx) * geo.s, geo.oy + (y - geo.vy) * geo.s];
  const noCaminho = (t: number) => amostras[Math.round(clamp(t, 0, 1) * (amostras.length - 1))];

  let ultimoTexto = -1e9;
  const desenhar = (p: number, agora: number, forcar: boolean) => {
    // céu
    opacidade(ceuNascer, suave(p, 0.05, 0.2), "cn");
    opacidade(ceuManha, suave(p, 0.22, 0.4), "cm");
    opacidade(ceuDia, suave(p, 0.55, 0.85), "cd");
    const quente = suave(p, 0.03, 0.15) * (1 - suave(p, 0.26, 0.42));
    opacidade(brilho, quente, "bn");
    const vNoite = 1 - suave(p, 0.03, 0.24);
    opacidade(noite, vNoite, "no");
    estilo(noite, "visibility", vNoite > 0 ? "visible" : "hidden", "nv");
    estilo(lua, "transform", `translateY(${(suave(p, 0, 0.24) * 40).toFixed(1)}px)`, "lu");
    opacidade(nuvens, suave(p, 0.1, 0.28), "nu");
    const q = quente.toFixed(2);
    if (cache.get("nq") !== q) {
      cache.set("nq", q);
      nuvens.style.setProperty("--quente", q);
    }

    // sol: sobe rápido no começo e desacelera até o meio-dia
    const tSol = solNoCaminho(p);
    const [sx, sy] = noCaminho(tSol);
    const [px, py] = tela(sx, sy);
    const meio = 220 * geo.s;
    estilo(sol, "transform", `translate3d(${(px - meio).toFixed(1)}px,${(py - meio).toFixed(1)}px,0)`, "sol");
    atributo(mascara, "stroke-dashoffset", (1 - tSol).toFixed(4), "arco");
    horas.forEach((h, i) => atributo(h.g, "opacity", suave(tSol, h.t + 0.14, h.t + 0.2).toFixed(2), `h${i}`));

    // paisagem: a câmera desce até o chão e a sombra da madrugada vai embora
    const desce = 1 - suave(p, 0, 0.45);
    opacidade(sombraNoite, 1 - suave(p, 0.02, 0.3), "sn");
    paisagens.forEach((c, i) =>
      estilo(c.el, "transform", `translate3d(0,${(110 * c.fator * desce * geo.s).toFixed(1)}px,0)`, `pt${i}`),
    );

    // sombras longas de manhã, curtas ao meio-dia
    const elevacao = clamp((600 - sy) / 435, 0, 1);
    const L = 40 + (1 - elevacao) * 260;
    atributo(sombraIpe, "cx", String(Math.round(920 + clamp((920 - sx) / 300, -1, 1) * L * 0.5)), "si");
    atributo(sombraIpe, "rx", String(Math.round(46 + L * 0.3)), "sir");
    atributo(sombraCasa, "cx", String(Math.round(1290 + clamp((1290 - sx) / 300, -1, 1) * L * 0.45)), "sc");
    atributo(sombraCasa, "rx", String(Math.round(200 + L * 0.3)), "scr");

    // placas uma a uma: acendem, dão um pulinho e soltam um brilho
    let soma = 0;
    for (const pl of placas) {
      const inicio = 0.34 + pl.ordem * 0.03;
      const v = suave(p, inicio, inicio + 0.07);
      soma += v;
      const pulo = Math.sin(Math.PI * v);
      atributo(pl.luz, "opacity", v.toFixed(3), `l${pl.ordem}`);
      atributo(
        pl.g,
        "transform",
        `translate(${pl.cx} ${pl.cy}) scale(${(1 + 0.14 * pulo).toFixed(3)}) translate(${-pl.cx} ${-pl.cy})`,
        `g${pl.ordem}`,
      );
      atributo(pl.faixa, "transform", `translate(${((v - 0.5) * pl.largura * 1.7).toFixed(1)} 0)`, `x${pl.ordem}`);
      atributo(pl.faisca, "transform", `translate(${pl.fx} ${pl.fy}) scale(${(0.4 + 0.8 * pulo).toFixed(3)})`, `s${pl.ordem}`);
      atributo(pl.faisca, "opacity", pulo.toFixed(3), `o${pl.ordem}`);
    }
    const energia = soma / placas.length;
    atributo(janelas, "opacity", (suave(energia, 0.45, 0.95) * 0.92).toFixed(3), "ja");
    atributo(fluxo, "opacity", suave(energia, 0.12, 0.45).toFixed(3), "fl");
    atributo(vento, "opacity", suave(p, 0.46, 0.56).toFixed(3), "ve");
    // o relógio de luz gira ao contrário
    atributo(ponteiro, "transform", `rotate(${Math.round(-clamp((p - 0.4) / 0.6, 0, 1) * 1080)} 1058 626)`, "po");
    estilo(barra, "transform", `scaleX(${energia.toFixed(3)})`, "ba");

    // tuiuiú atravessa o céu no intervalo entre os textos
    const tv = (p - 0.22) / 0.15;
    const voa = tv > 0 && tv < 1;
    estilo(ave, "visibility", voa ? "visible" : "hidden", "av");
    if (cache.get("avc") !== voa) {
      cache.set("avc", voa);
      ave.classList.toggle("hero__ave--voando", voa);
    }
    if (voa) {
      const bx = (-0.2 + tv * 1.4) * geo.W;
      const by = tela(0, 300)[1] + Math.sin(tv * Math.PI * 3) * 10 * geo.s;
      const giro = (Math.cos(tv * Math.PI * 3) * -4).toFixed(1);
      estilo(ave, "transform", `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0) rotate(${giro}deg)`, "avt");
    }

    // painel de hora e geração, no máximo 10 vezes por segundo
    const txtHora = relogio(tSol);
    const txtKw = `${(energia * 4.8).toFixed(1).replace(".", ",")} kW`;
    if ((forcar || agora - ultimoTexto > 100) && (txtHora !== hora.textContent || txtKw !== kw.textContent)) {
      ultimoTexto = agora;
      hora.textContent = txtHora;
      kw.textContent = txtKw;
    }
    opacidade(dica, 1 - suave(p, 0, 0.05), "di");

    // faixas de texto
    faixas.forEach((f, i) => {
      opacidade(f, opacidadeDaFaixa(p, i), `f${i}`);
      const k = montagemDaFaixa(p, i);
      if (k !== faixasK[i]) {
        faixasK[i] = k;
        f.style.setProperty("--k", k.toFixed(3));
      }
    });
    estilo(faixaFinal, "pointerEvents", p > FAIXAS[2][0] + 0.01 ? "auto" : "none", "pe");
  };

  // loop suave que descansa quando chega ao alvo
  let alvo = 0;
  let mostrado = 0;
  let quadro: number | null = null;
  let ultimoTick = 0;
  let naTela = true;
  const progresso = () => {
    const r = hero.getBoundingClientRect();
    const curso = r.height - innerHeight;
    return curso > 0 ? clamp(-r.top / curso, 0, 1) : 1;
  };
  const tick = (agora: number) => {
    const dt = Math.min(100, agora - (ultimoTick || agora));
    ultimoTick = agora;
    mostrado += (alvo - mostrado) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    const parou = Math.abs(alvo - mostrado) < 0.0005;
    if (parou) {
      mostrado = alvo;
      quadro = null;
      ultimoTick = 0;
    } else {
      quadro = requestAnimationFrame(tick);
    }
    desenhar(mostrado, agora, parou);
  };

  // barra do topo: links brancos no céu escuro, azuis no céu claro, faixa sólida quando o hero sai; o flutuante junto
  const atualizarBarra = () => {
    const solido = hero.getBoundingClientRect().bottom < innerHeight - 2;
    const claro = reduzido.matches || progresso() > 0.3;
    topo?.classList.toggle("topo--sobre-claro", claro);
    topo?.classList.toggle("topo--solida", solido);
    flutuante?.classList.toggle("flutuante--visivel", solido);
  };
  const aoRolar = () => {
    atualizarBarra();
    if (reduzido.matches) return;
    alvo = progresso();
    if (quadro === null && naTela) quadro = requestAnimationFrame(tick);
  };
  const aplicarModo = () => {
    if (quadro !== null) cancelAnimationFrame(quadro);
    quadro = null;
    cache.clear();
    faixasK.fill(-1);
    mostrado = alvo = reduzido.matches ? 1 : progresso();
    desenhar(mostrado, performance.now(), true);
    atualizarBarra();
  };
  const aoRedimensionar = () => {
    enquadrar();
    desenhar(mostrado, performance.now(), true);
    aoRolar();
  };
  const observador = new IntersectionObserver(([entrada]) => {
    naTela = entrada.isIntersecting;
    palco.classList.toggle("pausado", !naTela);
    if (naTela) aoRolar();
  });
  const aoMudarAba = () => document.body.classList.toggle("aba-oculta", document.hidden);

  enquadrar();
  aplicarModo();
  hero.classList.add("hero--pronto");
  observador.observe(hero);
  reduzido.addEventListener("change", aplicarModo);
  addEventListener("scroll", aoRolar, { passive: true });
  addEventListener("resize", aoRedimensionar);
  document.addEventListener("visibilitychange", aoMudarAba);

  return () => {
    if (quadro !== null) cancelAnimationFrame(quadro);
    observador.disconnect();
    reduzido.removeEventListener("change", aplicarModo);
    removeEventListener("scroll", aoRolar);
    removeEventListener("resize", aoRedimensionar);
    document.removeEventListener("visibilitychange", aoMudarAba);
    document.body.classList.remove("aba-oculta");
    topo?.classList.remove("topo--sobre-claro", "topo--solida");
    flutuante?.classList.remove("flutuante--visivel");
    hero.classList.remove("hero--pronto");
  };
}
```

Em `components/hero/Hero.tsx`, acrescente `import { MotorDoHero } from "./MotorDoHero";` aos imports e `<MotorDoHero />` logo depois de `<div className="hero__palco" id="hero-palco">`.

- [ ] **Passo 4: O CSS dos estados**

No fim do `@layer components` de `components/hero/hero.css`, antes do `}` que fecha a camada, acrescente:

```css
  /* no retrato, o servidor não sabe o enquadramento: a cena surge quando o motor o aplica */
  @media (scripting: enabled) and (max-aspect-ratio: 1/1) {
    .hero:not(.hero--pronto) .hero__cena {
      opacity: 0;
    }
  }
```

Em `components/layout/barra-topo.css`, antes do `@media (max-width: 860px)`, acrescente:

```css
  /* Na Início, com JavaScript: transparente sobre o céu do hero. O MotorDoHero liga topo--sobre-claro e topo--solida. */
  @media (scripting: enabled) {
    body:has(.hero) .topo:not(.topo--solida) {
      background: transparent;
      box-shadow: none;
      color: var(--color-papel);
    }
    body:has(.hero) .topo--sobre-claro:not(.topo--solida) {
      color: var(--color-profundo);
    }
    body:has(.hero) .topo:not(.topo--solida, .topo--sobre-claro)
      :is(.topo__placa, .topo__links a, .topo__chamada, .topo__icone):focus-visible {
      outline-color: var(--color-ipe);
    }
  }
```

Em `components/layout/whatsapp-flutuante.css`, troque a `transition` do `.flutuante` por:

```css
    transition:
      transform 0.3s var(--ease-saida),
      opacity 0.3s var(--ease-saida),
      visibility 0.3s;
```

e acrescente antes do `@media (max-width: 860px)`:

```css
  /* Na Início, com JavaScript: só aparece depois do hero (o MotorDoHero liga flutuante--visivel). */
  @media (scripting: enabled) {
    body:has(.hero) .flutuante:not(.flutuante--visivel) {
      visibility: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.9);
    }
  }
```

- [ ] **Passo 5: Levar os testes do botão flutuante para fora da Início**

Na Início, o botão flutuante só aparece depois do hero. Os testes do Plano 1 que clicam nele passam a usar a página Sobre.
- Em `tests/e2e/whatsapp.spec.ts`, nos dois primeiros testes do `test.describe("WhatsApp no modo conceito", …)`, troque `await page.goto("/");` por `await page.goto("/sobre");`.
- Em `tests/e2e/geometria.spec.ts`, faça a mesma troca em todos os testes.

- [ ] **Passo 6: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test`
Esperado: PASS em toda a bateria de ponta a ponta, nos dois projetos.

Se o teste de quadros lentos falhar:
- rode-o sozinho três vezes (`npx playwright test -g "não engasga" --repeat-each=3`);
- se falhar sempre, investigue com superpowers:systematic-debugging: procure escrita por quadro em elemento grande ou animação fora de `transform` e `opacity`;
- não afrouxe o limite de 2%, que é da spec.

- [ ] **Passo 7: Conferir com os próprios olhos**

Com o `npm run dev` rodando, abra http://localhost:3000 e role devagar até o simulador. Confira:
- o sol nasce, as placas acendem uma a uma e o relógio chega a 12:00;
- a barra passa de links brancos a azuis e depois a sólida;
- o botão flutuante só aparece depois do hero.

No celular (DevTools, 375 × 812), confira também a cena em pé.

- [ ] **Passo 8: Commit**

```bash
git add components/hero components/layout tests/e2e
git commit -m "feat: motor do hero, estados da barra e botão flutuante na Início

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 8: "O que a gente faz" e "Como funciona"

**Arquivos:**
- Criar:
  - `components/ui/Revelar.tsx` e `components/ui/revelar.css`;
  - `components/inicio/IconeServico.tsx`, `components/inicio/OQueFazemos.tsx` e `components/inicio/fazemos.css`;
  - `components/inicio/ComoFunciona.tsx` e `components/inicio/como.css`;
  - `app/servicos/[slug]/page.tsx`.
- Modificar: `app/page.tsx`, `app/globals.css`
- Teste: `tests/e2e/secoes.spec.ts`

**Interfaces:**
- Consome:
  - `Secao` (Tarefa 4);
  - `servicos` e `inicio.oQueFazemos` e `inicio.comoFunciona` (Tarefa 2);
  - `EmConstrucao` (Plano 1).
- Produz:
  - `Revelar({ children, className? })` (cliente), que gera `<div class="revelar …">` e ganha `data-revelado` ao entrar na tela;
  - a classe `revelar__item`, com a variável `--ordem` para o atraso;
  - `IconeServico({ nome, className? })`;
  - as páginas `/servicos/{slug}` provisórias, que o Plano 3 substitui.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/secoes.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("seções da Início", () => {
  test("O que a gente faz: quatro cartões que levam às páginas de serviço", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#o-que-fazemos");
    await expect(secao.getByRole("heading", { level: 2 })).toHaveText("Do telhado da casa ao pivô da fazenda.");
    await expect(secao.getByRole("listitem")).toHaveCount(4);
    await secao.getByRole("link", { name: "Energia solar para casa" }).click();
    await expect(page).toHaveURL(/\/servicos\/energia-solar-residencial$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Energia solar para casa");
  });

  test("Como funciona: quatro passos e o caminho do sol que se desenha ao aparecer", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#como-funciona");
    await expect(secao.getByRole("listitem")).toHaveCount(4);
    const trilha = secao.locator(".revelar");
    await expect(trilha).not.toHaveAttribute("data-revelado");
    await secao.scrollIntoViewIfNeeded();
    await expect(trilha).toHaveAttribute("data-revelado", "");
    await expect
      .poll(() => secao.locator(".como__caminho").evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });
});

test.describe("seções sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("os passos de Como funciona aparecem sem esperar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#como-funciona li").first()).toHaveCSS("opacity", "1");
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/secoes.spec.ts`
Esperado: FAIL nos 3 testes, porque não existem `#o-que-fazemos` nem `#como-funciona`.

- [ ] **Passo 3: A entrada ao aparecer**

Crie `components/ui/Revelar.tsx`:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Marca o bloco com data-revelado quando ele entra na tela. O CSS cuida da entrada; sem JavaScript, tudo já aparece. */
export function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.revelado = "";
        observador.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ? `revelar ${className}` : "revelar"}>
      {children}
    </div>
  );
}
```

Crie `components/ui/revelar.css`:

```css
/* Entrada suave dos itens quando o bloco aparece. Só com JavaScript e sem movimento reduzido. */
@layer components {
  .revelar__item {
    transition:
      opacity 0.6s var(--ease-saida),
      transform 0.6s var(--ease-saida);
    transition-delay: calc(var(--ordem, 0) * 90ms);
  }
  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
    .revelar:not([data-revelado]) .revelar__item {
      opacity: 0;
      transform: translateY(18px);
    }
  }
}
```

- [ ] **Passo 4: Os ícones dos serviços e "O que a gente faz"**

Crie `components/inicio/IconeServico.tsx`:

```tsx
import type { ReactNode } from "react";
import type { IconeServico as Nome } from "@/content/tipos";

const DESENHOS: Record<Nome, ReactNode> = {
  casa: (
    <>
      <circle cx="98" cy="20" r="11" fill="#FFD23F" />
      <path d="M10 80 H110" />
      <rect x="28" y="46" width="52" height="34" fill="#FFF3DC" />
      <path d="M20 48 L54 20 L88 48 Z" fill="#E2683C" />
      <path d="M58 27 L72 38 L66 43 L52 32 Z" fill="#4FB6EE" />
      <rect x="46" y="58" width="16" height="22" fill="#8B5A3C" />
      <rect x="33" y="54" width="9" height="9" fill="#3FA2DB" />
    </>
  ),
  empresa: (
    <>
      <path d="M10 80 H110" />
      <path d="M28 34 L36 18 H58 L50 34 Z M62 34 L70 18 H92 L84 34 Z" fill="#4FB6EE" />
      <rect x="22" y="34" width="76" height="46" fill="#FFF3DC" />
      <path d="M18 34 H102 L96 46 H24 Z" fill="#3FA2DB" />
      <path d="M38 34 L36 46 M56 34 L55 46 M74 34 L74 46 M90 34 L91 46" />
      <rect x="30" y="54" width="22" height="26" fill="#2C4A6B" />
      <rect x="60" y="54" width="30" height="16" fill="#3FA2DB" />
    </>
  ),
  campo: (
    <>
      <circle cx="22" cy="20" r="10" fill="#FFD23F" />
      <path d="M6 80 H114" />
      <path d="M60 80 V46 Q60 30 82 30 Q104 30 104 46 V80 Z" fill="#E2683C" />
      <rect x="74" y="56" width="16" height="24" fill="#8B5A3C" />
      <path d="M10 66 L22 50 H48 L36 66 Z" fill="#4FB6EE" />
      <path d="M22 66 V80 M34 66 V80" />
      <path d="M40 80 l4 -8 l4 7 l4 -9 l4 8" stroke="#3B8A55" />
    </>
  ),
  limpeza: (
    <>
      <path d="M8 80 H112" />
      <path d="M18 64 L44 28 H96 L70 64 Z" fill="#4FB6EE" />
      <path d="M31 46 H83 M70 28 L44 64" />
      <path d="M44 64 V80 M70 64 V80" />
      <path d="M100 44 C100 44 94 52 94 56 A6 6 0 0 0 106 56 C106 52 100 44 100 44 Z" fill="#D6EEFB" />
      <path d="M84 12 L104 32" />
      <path d="M98 38 L110 26" strokeWidth="6" />
    </>
  ),
};

/** Ilustração pequena de cada serviço, no traço do hero. Decorativa. */
export function IconeServico({ nome, className }: { nome: Nome; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {DESENHOS[nome]}
      </g>
    </svg>
  );
}
```

Crie `components/inicio/OQueFazemos.tsx`:

```tsx
import Link from "next/link";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { servicos } from "@/content/servicos";
import { IconeServico } from "./IconeServico";

/** Os quatro serviços em cartões, cada um levando à sua página. */
export function OQueFazemos() {
  return (
    <Secao id="o-que-fazemos" rotulo={inicio.oQueFazemos.rotulo} titulo={inicio.oQueFazemos.titulo}>
      <ul className="fazemos__lista">
        {servicos.map((s) => (
          <li key={s.slug} className="fazemos__cartao">
            <IconeServico nome={s.icone} className="fazemos__icone" />
            <h3 className="fazemos__titulo">{s.cartao.titulo}</h3>
            <p className="fazemos__texto">{s.cartao.texto}</p>
            <Link className="fazemos__link" href={`/servicos/${s.slug}`}>
              {s.nome} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
```

Crie `components/inicio/fazemos.css`:

```css
@layer components {
  .fazemos__lista {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 48px;
    padding: 0;
    list-style: none;
  }
  .fazemos__cartao {
    display: flex;
    flex-direction: column;
    padding: 22px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 20px;
    background: var(--color-papel);
    box-shadow: var(--shadow-dura);
  }
  .fazemos__icone {
    width: 100%;
    max-width: 140px;
    height: auto;
    margin-bottom: 18px;
  }
  .fazemos__titulo {
    font-weight: 800;
    font-size: 1.3rem;
    line-height: 1.15;
  }
  .fazemos__texto {
    margin-top: 8px;
    color: var(--color-tinta-suave);
  }
  .fazemos__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    margin-top: auto;
    padding-top: 16px;
    font-weight: 600;
    text-underline-offset: 4px;
  }
  @media (max-width: 1000px) {
    .fazemos__lista {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 560px) {
    .fazemos__lista {
      grid-template-columns: 1fr;
    }
  }
}
```

- [ ] **Passo 5: Página provisória de cada serviço**

O Next pré-carrega os links dos cartões, e sem a rota o console mostraria erros 404. O Plano 3 substitui esta página pela de verdade. Antes de escrever, leia `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`.

Crie `app/servicos/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmConstrucao } from "@/components/ui/EmConstrucao";
import { servicos } from "@/content/servicos";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: servicos.find((s) => s.slug === slug)?.nome };
}

export default async function PaginaServico({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  return <EmConstrucao titulo={servico.nome} texto="A página deste serviço chega no Plano 3." />;
}
```

- [ ] **Passo 6: "Como funciona", com o caminho do sol ligando os passos**

Crie `components/inicio/ComoFunciona.tsx`:

```tsx
import type { CSSProperties } from "react";
import { Revelar } from "@/components/ui/Revelar";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";

const t = inicio.comoFunciona;

/** Os quatro passos, ligados pelo pontilhado amarelo do caminho do sol, que se desenha quando a seção aparece. */
export function ComoFunciona() {
  return (
    <Secao id="como-funciona" titulo={t.titulo} className="como">
      <Revelar className="como__trilha">
        <div className="como__caminho" aria-hidden="true">
          <div className="como__pontos" />
        </div>
        <ol className="como__passos">
          {t.passos.map((passo, i) => (
            <li key={passo.titulo} className="como__passo revelar__item" style={{ "--ordem": i } as CSSProperties}>
              <span className="como__numero" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="como__cartao">
                <h3 className="como__titulo">{passo.titulo}</h3>
                <p className="como__texto">{passo.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Revelar>
    </Secao>
  );
}
```

Crie `components/inicio/como.css`:

```css
/* O caminho do sol (o mesmo pontilhado amarelo de contorno azul do hero) liga os quatro passos.
   Ele se desenha com dois transforms opostos: a janela anda para a direita e os pontos para a esquerda. */
@layer components {
  .como__trilha {
    position: relative;
    margin-top: 48px;
  }
  .como__caminho {
    position: absolute;
    top: 22px;
    left: 12.5%;
    right: 12.5%;
    height: 12px;
    overflow: hidden;
  }
  .como__pontos {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #ffd23f 3px, var(--color-profundo) 3.5px 5.5px, transparent 6px) 0 50% /
      24px 12px repeat-x;
  }
  .como__caminho,
  .como__pontos {
    transition: transform 1.2s var(--ease-meio);
  }
  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
    .revelar:not([data-revelado]) .como__caminho {
      transform: translateX(-100%);
    }
    .revelar:not([data-revelado]) .como__pontos {
      transform: translateX(100%);
    }
  }
  .como__passos {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 0;
    list-style: none;
  }
  .como__passo {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 18px;
  }
  .como__numero {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 50%;
    background: var(--color-ipe);
    box-shadow: 0 4px 0 var(--color-profundo);
    font: 500 0.95rem/1 var(--font-mono);
  }
  .como__cartao {
    width: 100%;
    padding: 24px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 20px;
    background: var(--color-papel);
    box-shadow: var(--shadow-dura);
  }
  .como__titulo {
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 1.3rem;
    line-height: 1.15;
  }
  .como__texto {
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .como__caminho {
      top: 28px;
      bottom: 28px;
      left: 22px;
      right: auto;
      width: 12px;
      height: auto;
    }
    .como__pontos {
      background-size: 12px 24px;
      background-repeat: repeat-y;
      background-position: 50% 0;
    }
    @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
      .revelar:not([data-revelado]) .como__caminho {
        transform: translateY(-100%);
      }
      .revelar:not([data-revelado]) .como__pontos {
        transform: translateY(100%);
      }
    }
    .como__passos {
      grid-template-columns: 1fr;
    }
    .como__passo {
      grid-template-columns: 56px 1fr;
      justify-items: start;
      align-items: start;
    }
  }
}
```

- [ ] **Passo 7: Ligar na Início**

Em `app/globals.css`, acrescente depois do `@import "../components/ui/secao.css";`:

```css
@import "../components/ui/revelar.css";
```

e, depois do `@import "../components/inicio/simulador.css";`:

```css
@import "../components/inicio/fazemos.css";
@import "../components/inicio/como.css";
```

Troque `app/page.tsx` por:

```tsx
import { Hero } from "@/components/hero/Hero";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { OQueFazemos } from "@/components/inicio/OQueFazemos";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";

export default function Inicio() {
  return (
    <>
      <Hero />
      <OQueFazemos />
      <SecaoSimulador />
      <ComoFunciona />
    </>
  );
}
```

- [ ] **Passo 8: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/secoes.spec.ts tests/e2e/base.spec.ts`
Esperado: PASS. A base continua sem erros no console, porque as rotas dos serviços existem, e sem nada saindo pela direita.

- [ ] **Passo 9: Commit**

```bash
git add components/ui components/inicio app/servicos app/page.tsx app/globals.css tests/e2e/secoes.spec.ts
git commit -m "feat: seções O que a gente faz e Como funciona, com o caminho do sol

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 9: Promessas, depoimentos e perguntas

**Arquivos:**
- Criar:
  - `components/inicio/IconePromessa.tsx`, `components/inicio/Promessas.tsx` e `components/inicio/promessas.css`;
  - `components/inicio/Depoimentos.tsx` e `components/inicio/depoimentos.css`;
  - `components/inicio/Perguntas.tsx` e `components/inicio/perguntas.css`.
- Modificar: `app/page.tsx`, `app/globals.css`, `tests/e2e/secoes.spec.ts`
- Teste: `tests/e2e/secoes.spec.ts`

**Interfaces:**
- Consome:
  - `Secao` (Tarefa 4);
  - `inicio.promessas`, `inicio.depoimentos` e `inicio.perguntas` (Tarefa 2);
  - `depoimentos` e `perguntas` (Tarefa 2);
  - `config` (Plano 1).
- Produz: `Promessas()`, `Depoimentos()`, `Perguntas()` e `IconePromessa({ nome, className? })`.

- [ ] **Passo 1: Escrever os testes que falham**

Em `tests/e2e/secoes.spec.ts`, dentro do `test.describe("seções da Início", …)`, acrescente:

```ts
  test("promessas, depoimentos com a nota de conceito e oito perguntas que abrem", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#promessas h3")).toHaveCount(4);
    const depoimentos = page.locator("#depoimentos");
    await expect(depoimentos.locator("figure")).toHaveCount(3);
    await expect(depoimentos).toContainText("Depoimentos ilustrativos de um projeto conceito.");
    const perguntas = page.locator("#perguntas details");
    await expect(perguntas).toHaveCount(8);
    const primeira = perguntas.first();
    await primeira.locator("summary").click();
    await expect(primeira).toHaveAttribute("open", "");
    await expect(primeira).toContainText("em 2026, está em 60%");
  });

  test("títulos em ordem: um H1 e nenhum nível pulado", async ({ page }) => {
    await page.goto("/");
    const niveis = await page
      .locator("h1, h2, h3, h4")
      .evaluateAll((els) => els.map((el) => Number(el.tagName.slice(1))));
    expect(niveis[0]).toBe(1);
    expect(niveis.filter((n) => n === 1)).toHaveLength(1);
    for (let i = 1; i < niveis.length; i++) expect(niveis[i]!).toBeLessThanOrEqual(niveis[i - 1]! + 1);
  });
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/secoes.spec.ts`
Esperado: FAIL em "promessas, depoimentos…", porque não existe `#promessas`. O teste dos títulos já pode passar; ele protege a ordem quando as seções novas entrarem.

- [ ] **Passo 3: Os ícones das promessas e a seção**

Crie `components/inicio/IconePromessa.tsx`:

```tsx
import type { ReactNode } from "react";
import type { IconePromessa as Nome } from "@/content/tipos";

const DESENHOS: Record<Nome, ReactNode> = {
  atendimento: (
    <>
      <path
        d="M12 18 H68 Q72 18 72 22 V50 Q72 54 68 54 H34 L22 66 V54 H12 Q8 54 8 50 V22 Q8 18 12 18 Z"
        fill="#FFF3DC"
      />
      <path
        d="M40 46 C30 38 28 34 30 30 C32 26 38 26 40 31 C42 26 48 26 50 30 C52 34 50 38 40 46 Z"
        fill="#E2683C"
      />
    </>
  ),
  telhado: (
    <>
      <path d="M10 46 L40 20 L70 46 Z" fill="#E2683C" />
      <rect x="18" y="46" width="44" height="22" fill="#FFF3DC" />
      <path d="M28 56 L36 63 L52 49" strokeWidth="5" />
    </>
  ),
  proposta: (
    <>
      <path d="M18 8 H50 L62 20 V72 H18 Z" fill="#FAFAF5" />
      <path d="M50 8 V20 H62" />
      <path d="M26 32 H54 M26 42 H54 M26 52 H44" />
      <circle cx="56" cy="60" r="10" fill="#F5B800" />
      <path d="M51 60 L55 64 L61 56" />
    </>
  ),
  protocolo: (
    <>
      <rect x="16" y="14" width="48" height="58" rx="6" fill="#FFF3DC" />
      <rect x="28" y="8" width="24" height="12" rx="4" fill="#3FA2DB" />
      <path d="M26 34 H54 M26 44 H54" />
      <circle cx="50" cy="58" r="8" fill="#F5B800" />
      <path d="M46 58 L49 61 L54 55" />
    </>
  ),
};

/** Ilustração de cada promessa, no traço do hero. Decorativa. */
export function IconePromessa({ nome, className }: { nome: Nome; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {DESENHOS[nome]}
      </g>
    </svg>
  );
}
```

Crie `components/inicio/Promessas.tsx`:

```tsx
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { IconePromessa } from "./IconePromessa";

/** As quatro promessas, em grade 2 × 2: a resposta aos medos mais comuns da pesquisa. */
export function Promessas() {
  return (
    <Secao id="promessas" titulo={inicio.promessas.titulo} className="promessas">
      <ul className="promessas__lista">
        {inicio.promessas.itens.map((p) => (
          <li key={p.titulo} className="promessa">
            <IconePromessa nome={p.icone} className="promessa__icone" />
            <div>
              <h3 className="promessa__titulo">{p.titulo}</h3>
              <p className="promessa__texto">{p.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
```

Crie `components/inicio/promessas.css`:

```css
@layer components {
  .promessas {
    background: var(--color-ceu-claro);
    border-block: 2.5px solid var(--color-profundo);
  }
  .promessas__lista {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 36px 48px;
    margin-top: 48px;
    padding: 0;
    list-style: none;
  }
  .promessa {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 20px;
    align-items: start;
  }
  .promessa__icone {
    width: 80px;
    height: 80px;
  }
  .promessa__titulo {
    font-weight: 800;
    font-size: 1.35rem;
    line-height: 1.15;
  }
  .promessa__texto {
    margin-top: 8px;
    color: var(--color-tinta-suave);
  }
  @media (max-width: 760px) {
    .promessas__lista {
      grid-template-columns: 1fr;
    }
    .promessa {
      grid-template-columns: 64px 1fr;
    }
    .promessa__icone {
      width: 64px;
      height: 64px;
    }
  }
}
```

- [ ] **Passo 4: Depoimentos em balões de fala**

Crie `components/inicio/Depoimentos.tsx`:

```tsx
import { Secao } from "@/components/ui/Secao";
import { config } from "@/content/config";
import { depoimentos } from "@/content/depoimentos";
import { inicio } from "@/content/inicio";

/** Três depoimentos em balões de fala. No modo conceito, a nota avisa que são ilustrativos. */
export function Depoimentos() {
  return (
    <Secao id="depoimentos" titulo={inicio.depoimentos.titulo} className="depoimentos">
      <ul className="depoimentos__lista">
        {depoimentos.map((d) => (
          <li key={d.nome}>
            <figure className="depoimento">
              <blockquote className="depoimento__balao">
                <p>“{d.texto}”</p>
              </blockquote>
              <figcaption className="depoimento__autor">
                <strong>{d.nome}</strong>, {d.lugar} · {d.tipo}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {config.modoConceito && <p className="depoimentos__nota">{inicio.depoimentos.nota}</p>}
    </Secao>
  );
}
```

Crie `components/inicio/depoimentos.css`:

```css
@layer components {
  .depoimentos__lista {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    align-items: start;
    margin-top: 48px;
    padding: 0;
    list-style: none;
  }
  .depoimentos__lista > li:nth-child(2) {
    margin-top: 36px;
  }
  .depoimento {
    margin: 0;
  }
  .depoimento__balao {
    position: relative;
    margin: 0;
    padding: 24px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 22px;
    background: var(--color-papel);
    box-shadow: var(--shadow-dura);
    font-size: 1.1rem;
  }
  /* o rabicho do balão: um quadrado girado que cobre a borda de baixo */
  .depoimento__balao::after {
    content: "";
    position: absolute;
    left: 34px;
    bottom: -15px;
    width: 26px;
    height: 26px;
    border-right: 2.5px solid var(--color-profundo);
    border-bottom: 2.5px solid var(--color-profundo);
    background: var(--color-papel);
    transform: rotate(45deg);
  }
  .depoimento__autor {
    margin-top: 28px;
    padding-left: 20px;
  }
  .depoimentos__nota {
    margin-top: 32px;
    font-size: 0.9rem;
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .depoimentos__lista {
      grid-template-columns: 1fr;
    }
    .depoimentos__lista > li:nth-child(2) {
      margin-top: 0;
    }
  }
}
```

- [ ] **Passo 5: Perguntas frequentes**

Crie `components/inicio/Perguntas.tsx`:

```tsx
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";

/** As oito perguntas em details/summary: funcionam sem JavaScript e pelo teclado. */
export function Perguntas() {
  return (
    <Secao id="perguntas" titulo={inicio.perguntas.titulo} className="perguntas">
      <div className="perguntas__lista">
        {perguntas.map((p) => (
          <details key={p.pergunta} className="pergunta">
            <summary className="pergunta__titulo">
              <span>{p.pergunta}</span>
              <span className="pergunta__sinal" aria-hidden="true" />
            </summary>
            <p className="pergunta__resposta">{p.resposta}</p>
          </details>
        ))}
      </div>
    </Secao>
  );
}
```

Crie `components/inicio/perguntas.css`:

```css
/* Título à esquerda e a lista à direita, para não repetir o esqueleto dos depoimentos. */
@layer components {
  .perguntas .secao__miolo {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 48px;
    align-items: start;
  }
  .pergunta {
    border: 2.5px solid var(--color-profundo);
    border-radius: 18px;
    background: var(--color-papel);
  }
  .pergunta + .pergunta {
    margin-top: 12px;
  }
  .pergunta__titulo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 44px;
    padding: 16px 20px;
    font-weight: 600;
    font-size: 1.08rem;
    list-style: none;
    cursor: pointer;
  }
  .pergunta__titulo::-webkit-details-marker {
    display: none;
  }
  .pergunta__sinal {
    position: relative;
    flex: none;
    width: 28px;
    height: 28px;
    border: 2px solid var(--color-profundo);
    border-radius: 50%;
    background: var(--color-ipe);
  }
  .pergunta__sinal::before,
  .pergunta__sinal::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 12px;
    height: 2.5px;
    background: var(--color-profundo);
    transform: translate(-50%, -50%);
    transition: transform 0.3s var(--ease-saida);
  }
  .pergunta__sinal::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .pergunta[open] .pergunta__sinal::after {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  .pergunta__resposta {
    max-width: 62ch;
    padding: 0 20px 20px;
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .perguntas .secao__miolo {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .perguntas__lista {
      margin-top: 32px;
    }
  }
}
```

- [ ] **Passo 6: Ligar na Início**

Em `app/globals.css`, acrescente depois do `@import "../components/inicio/como.css";`:

```css
@import "../components/inicio/promessas.css";
@import "../components/inicio/depoimentos.css";
@import "../components/inicio/perguntas.css";
```

Em `app/page.tsx`, acrescente os imports de `Promessas`, `Depoimentos` e `Perguntas` (de `@/components/inicio/…`) e, depois de `<ComoFunciona />`:

```tsx
      <Promessas />
      <Depoimentos />
      <Perguntas />
```

- [ ] **Passo 7: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/secoes.spec.ts tests/e2e/base.spec.ts`
Esperado: PASS.

- [ ] **Passo 8: Commit**

```bash
git add components/inicio app/page.tsx app/globals.css tests/e2e/secoes.spec.ts
git commit -m "feat: promessas, depoimentos e perguntas frequentes na Início

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 10: Pedido de orçamento: validação, e-mail e ação do servidor

**Arquivos:**
- Criar: `lib/pedido.ts`, `lib/email.ts`, `app/actions/pedido.ts`
- Modificar: `content/tipos.ts` (campo `remetente` em `Empresa`), `content/empresa.ts`, `tests/unit/conteudo.test.ts`
- Teste: `tests/unit/pedido.test.ts`, `tests/unit/email.test.ts`, `tests/unit/acao-pedido.test.ts`

**Interfaces:**
- Consome:
  - `formulario` e `TextosFormulario` (Tarefa 2);
  - `config`, `empresa` e `SITE_URL` (Plano 1).
- Produz:
  - em `lib/pedido.ts`:
    - os tipos `Pedido`, `ErrosPedido` e `ResultadoValidacao`;
    - a lista `CAMPOS: CampoPedido[]`;
    - `normalizarWhatsapp(valor: string): string | null`;
    - `validarPedido(entrada: Record<string, unknown>, t: TextosFormulario): ResultadoValidacao`;
    - `pareceRobo(entrada: Record<string, unknown>, agora: number): boolean`;
  - em `lib/email.ts`:
    - os tipos `Email`, `Destino` e `Transporte`;
    - `montarEmail(pedido, destino, siteUrl): Email`;
    - `destinoDoPedido(config, empresa): Destino`;
    - `transporteTeste`, `transporteIndisponivel` e `escolherTransporte(env?)`;
  - em `app/actions/pedido.ts`: `EstadoPedido` e `enviarPedido(anterior: EstadoPedido, dados: FormData): Promise<EstadoPedido>`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/unit/pedido.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formulario } from "@/content/formulario";
import { normalizarWhatsapp, pareceRobo, validarPedido } from "@/lib/pedido";

const valido = {
  nome: "Ana Souza",
  whatsapp: "(65) 99999-8888",
  cidade: "Cuiabá, Jardim Itália",
  conta: "R$ 300 a R$ 600",
  onde: "Casa",
  mensagem: "",
};

describe("normalizarWhatsapp", () => {
  it("aceita 10 ou 11 dígitos, com ou sem +55", () => {
    expect(normalizarWhatsapp("(65) 99999-8888")).toBe("65999998888");
    expect(normalizarWhatsapp("+55 65 3322-1100")).toBe("6533221100");
    expect(normalizarWhatsapp("55 65 99999-8888")).toBe("65999998888");
  });

  it("recusa número curto, longo ou vazio", () => {
    expect(normalizarWhatsapp("99999-8888")).toBeNull();
    expect(normalizarWhatsapp("1234567890123456")).toBeNull();
    expect(normalizarWhatsapp("")).toBeNull();
  });
});

describe("validarPedido", () => {
  it("pedido completo passa, com o WhatsApp normalizado e os textos sem espaços nas pontas", () => {
    const r = validarPedido({ ...valido, nome: "  Ana Souza " }, formulario);
    expect(r).toEqual({ ok: true, pedido: { ...valido, whatsapp: "65999998888" } });
  });

  it("campos obrigatórios vazios dão as mensagens da spec", () => {
    const r = validarPedido({}, formulario);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erros).toEqual({
      nome: "Coloque seu nome.",
      whatsapp: "Confira o número do WhatsApp, com DDD.",
      conta: "Escolha o valor médio da conta.",
      onde: "Escolha onde quer instalar.",
    });
  });

  it("limites de tamanho: nome até 80, cidade até 80, mensagem até 1.000", () => {
    const r = validarPedido(
      { ...valido, nome: "a".repeat(81), cidade: "b".repeat(81), mensagem: "c".repeat(1001) },
      formulario,
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.erros).sort()).toEqual(["cidade", "mensagem", "nome"]);
    expect(r.erros.nome).toBe("Use até 80 caracteres no nome.");
  });

  it("nome de uma letra não passa; opção fora da lista não passa", () => {
    const r = validarPedido({ ...valido, nome: "A", conta: "R$ 5 mil", onde: "Lua" }, formulario);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.erros).sort()).toEqual(["conta", "nome", "onde"]);
  });

  it("um arquivo no lugar de um texto conta como vazio", () => {
    const r = validarPedido({ ...valido, nome: new Blob(["x"]) }, formulario);
    expect(r.ok).toBe(false);
  });
});

describe("pareceRobo", () => {
  const agora = 1_000_000;

  it("campo armadilha preenchido é robô", () => {
    expect(pareceRobo({ site: "http://spam.example" }, agora)).toBe(true);
  });

  it("envio em menos de 3 segundos é robô; com 3 segundos ou mais, não", () => {
    expect(pareceRobo({ site: "", inicio: String(agora - 2999) }, agora)).toBe(true);
    expect(pareceRobo({ site: "", inicio: String(agora - 3000) }, agora)).toBe(false);
  });

  it("sem o carimbo (sem JavaScript), só a armadilha vale", () => {
    expect(pareceRobo({ site: "", inicio: "" }, agora)).toBe(false);
    expect(pareceRobo({}, agora)).toBe(false);
  });
});
```

Crie `tests/unit/email.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { destinoDoPedido, escolherTransporte, montarEmail, transporteTeste } from "@/lib/email";

const pedido = {
  nome: "Ana Souza",
  whatsapp: "65999998888",
  cidade: "",
  conta: "R$ 300 a R$ 600",
  onde: "Casa",
  mensagem: "Telhado de cerâmica.",
};

describe("e-mail do pedido", () => {
  afterEach(() => vi.restoreAllMocks());

  it("assunto com nome e lugar, e o corpo com todos os campos e o endereço do site", () => {
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://ipe-solar.vercel.app");
    expect(email.assunto).toBe("Pedido de orçamento: Ana Souza (Casa)");
    expect(email.para).toBe("a@exemplo.com");
    expect(email.texto).toContain("WhatsApp: 65999998888");
    expect(email.texto).toContain("Cidade e bairro: não informado");
    expect(email.texto).toContain("Valor médio da conta: R$ 300 a R$ 600");
    expect(email.texto).toContain("Mensagem: Telhado de cerâmica.");
    expect(email.texto).toContain("https://ipe-solar.vercel.app");
  });

  it("no modo conceito, vai para o autor pelo remetente de teste do Resend", () => {
    expect(destinoDoPedido(config, empresa)).toEqual({ para: "gustavowalien@gmail.com", de: "onboarding@resend.dev" });
  });

  it("fora do modo conceito, vai para a empresa pelo remetente dela", () => {
    const real = { ...empresa, emailPedidos: "pedidos@exemplo.com.br", remetente: "site@exemplo.com.br" };
    expect(destinoDoPedido({ ...config, modoConceito: false }, real)).toEqual({
      para: "pedidos@exemplo.com.br",
      de: "site@exemplo.com.br",
    });
  });

  it("o transporte de teste não sai para a rede e simula falha com “Teste Falha”", async () => {
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await transporteTeste(email)).toEqual({ ok: true });
    expect(await transporteTeste({ ...email, assunto: "Pedido de orçamento: Teste Falha (Casa)" })).toEqual({
      ok: false,
    });
  });

  it("sem EMAIL_TRANSPORTE, até o Plano 5, o envio falha e o log não leva dado do pedido", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const enviar = escolherTransporte({});
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await enviar(email)).toEqual({ ok: false });
    expect(log).toHaveBeenCalledOnce();
    expect(JSON.stringify(log.mock.calls)).not.toContain("Ana");
    expect(escolherTransporte({ EMAIL_TRANSPORTE: "teste" })).toBe(transporteTeste);
  });
});
```

Crie `tests/unit/acao-pedido.test.ts`:

```ts
import { beforeAll, describe, expect, it } from "vitest";
import { enviarPedido, type EstadoPedido } from "@/app/actions/pedido";

const INICIAL: EstadoPedido = { status: "inicial" };

function dados(campos: Record<string, string>) {
  const fd = new FormData();
  for (const [chave, valor] of Object.entries(campos)) fd.set(chave, valor);
  return fd;
}

const valido = {
  nome: "Ana Souza",
  whatsapp: "(65) 99999-8888",
  cidade: "",
  conta: "Até R$ 300",
  onde: "Casa",
  mensagem: "",
  site: "",
  inicio: String(Date.now() - 10_000),
};

describe("enviarPedido", () => {
  beforeAll(() => {
    process.env.EMAIL_TRANSPORTE = "teste";
  });

  it("pedido válido é enviado", async () => {
    expect(await enviarPedido(INICIAL, dados(valido))).toEqual({ status: "enviado", nome: "Ana Souza" });
  });

  it("campos inválidos voltam com os erros e com os valores para preencher de novo", async () => {
    const estado = await enviarPedido(INICIAL, dados({ ...valido, nome: "", whatsapp: "123" }));
    expect(estado.status).toBe("invalido");
    if (estado.status !== "invalido") return;
    expect(Object.keys(estado.erros).sort()).toEqual(["nome", "whatsapp"]);
    expect(estado.valores.whatsapp).toBe("123");
    expect(estado.valores).not.toHaveProperty("site");
  });

  it("falha no envio volta como falha, com os valores", async () => {
    const estado = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha" }));
    expect(estado).toMatchObject({ status: "falha", valores: { nome: "Teste Falha" } });
  });

  it("robô recebe sucesso falso, sem envio (com “Teste Falha”, o envio daria falha)", async () => {
    const armadilha = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha", site: "spam" }));
    expect(armadilha.status).toBe("enviado");
    const rapido = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha", inicio: String(Date.now()) }));
    expect(rapido.status).toBe("enviado");
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/pedido.test.ts tests/unit/email.test.ts tests/unit/acao-pedido.test.ts`
Esperado: FAIL nos três arquivos, com "Failed to resolve import "@/lib/pedido"", "@/lib/email" e "@/app/actions/pedido".

- [ ] **Passo 3: O remetente da empresa**

Em `content/tipos.ts`, no tipo `Empresa`, acrescente depois de `emailPedidos: string;`:

```ts
  /** Remetente verificado no Resend (ex.: "site@empresa.com.br"). Só é usado com o modo conceito desligado. */
  remetente: string;
```

Em `content/empresa.ts`, acrescente `remetente: "",` depois de `emailPedidos: "",`.

Em `tests/unit/conteudo.test.ts`, no teste "com o modo conceito desligado, a empresa precisa de WhatsApp e e-mail de verdade", acrescente:

```ts
    expect(empresa.remetente).toMatch(EMAIL);
```

- [ ] **Passo 4: A validação**

Crie `lib/pedido.ts`:

```ts
import type { CampoPedido, TextosFormulario } from "@/content/tipos";

export type Pedido = Record<CampoPedido, string>;
export type ErrosPedido = Partial<Record<CampoPedido, string>>;
export type ResultadoValidacao = { ok: true; pedido: Pedido } | { ok: false; erros: ErrosPedido };

/** Os campos na ordem da tela: o foco vai para o primeiro com erro. */
export const CAMPOS: CampoPedido[] = ["nome", "whatsapp", "cidade", "conta", "onde", "mensagem"];

/** Só os dígitos do WhatsApp, sem o 55: DDD e número, com 10 ou 11 dígitos. Fora disso, null. */
export function normalizarWhatsapp(valor: string): string | null {
  let digitos = valor.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) digitos = digitos.slice(2);
  return digitos.length === 10 || digitos.length === 11 ? digitos : null;
}

const ler = (entrada: Record<string, unknown>, campo: string) => {
  const valor = entrada[campo];
  return typeof valor === "string" ? valor.trim() : "";
};

/** Valida o pedido com as regras da spec (seção 8) e as mensagens de content/formulario.ts. */
export function validarPedido(entrada: Record<string, unknown>, t: TextosFormulario): ResultadoValidacao {
  const nome = ler(entrada, "nome");
  const whatsapp = normalizarWhatsapp(ler(entrada, "whatsapp"));
  const cidade = ler(entrada, "cidade");
  const conta = ler(entrada, "conta");
  const onde = ler(entrada, "onde");
  const mensagem = ler(entrada, "mensagem");

  const erros: ErrosPedido = {};
  if (nome.length < 2) erros.nome = t.erros.nome;
  else if (nome.length > 80) erros.nome = t.erros.nomeLongo;
  if (!whatsapp) erros.whatsapp = t.erros.whatsapp;
  if (cidade.length > 80) erros.cidade = t.erros.cidade;
  if (!t.opcoesConta.includes(conta)) erros.conta = t.erros.conta;
  if (!t.opcoesOnde.includes(onde)) erros.onde = t.erros.onde;
  if (mensagem.length > 1000) erros.mensagem = t.erros.mensagem;

  if (!whatsapp || Object.keys(erros).length > 0) return { ok: false, erros };
  return { ok: true, pedido: { nome, whatsapp, cidade, conta, onde, mensagem } };
}

/**
 * Robô: preencheu o campo armadilha `site` ou enviou menos de 3 segundos depois de o formulário aparecer.
 * Sem JavaScript o carimbo `inicio` vem vazio, e só a armadilha vale.
 */
export function pareceRobo(entrada: Record<string, unknown>, agora: number): boolean {
  if (ler(entrada, "site") !== "") return true;
  const inicio = ler(entrada, "inicio");
  if (inicio === "") return false;
  const quando = Number(inicio);
  return Number.isFinite(quando) && agora - quando < 3000;
}
```

- [ ] **Passo 5: O e-mail**

Crie `lib/email.ts`:

```ts
import type { Config, Empresa } from "@/content/tipos";
import type { Pedido } from "./pedido";

export type Email = { para: string; de: string; assunto: string; texto: string };
export type Destino = { para: string; de: string };
export type Transporte = (email: Email) => Promise<{ ok: boolean }>;

/** O e-mail do pedido, em texto simples. */
export function montarEmail(pedido: Pedido, destino: Destino, siteUrl: string): Email {
  const linhas = [
    `Nome: ${pedido.nome}`,
    `WhatsApp: ${pedido.whatsapp}`,
    `Cidade e bairro: ${pedido.cidade || "não informado"}`,
    `Valor médio da conta: ${pedido.conta}`,
    `Onde quer instalar: ${pedido.onde}`,
    `Mensagem: ${pedido.mensagem || "sem mensagem"}`,
    "",
    `Enviado pelo formulário de ${siteUrl}`,
  ];
  return { ...destino, assunto: `Pedido de orçamento: ${pedido.nome} (${pedido.onde})`, texto: linhas.join("\n") };
}

/**
 * Para onde vai o pedido. No modo conceito, para o autor, pelo remetente de teste do Resend (sem domínio
 * verificado, o Resend só entrega para o dono da conta). Fora dele, para a empresa, pelo remetente verificado.
 */
export function destinoDoPedido(config: Config, empresa: Empresa): Destino {
  if (config.modoConceito) return { para: config.autor.email, de: "onboarding@resend.dev" };
  return { para: empresa.emailPedidos, de: empresa.remetente };
}

/** Transporte dos testes: nada sai para a rede. "Teste Falha" no assunto simula uma falha. */
export const transporteTeste: Transporte = async (email) => ({ ok: !email.assunto.includes("Teste Falha") });

/** Até o Plano 5 (integração do Resend pela Vercel), o envio real avisa no log, sem dados do pedido, e falha. */
export const transporteIndisponivel: Transporte = async () => {
  console.error("Envio de e-mail não configurado: a integração do Resend chega no Plano 5.");
  return { ok: false };
};

export function escolherTransporte(env: Record<string, string | undefined> = process.env): Transporte {
  return env.EMAIL_TRANSPORTE === "teste" ? transporteTeste : transporteIndisponivel;
}
```

- [ ] **Passo 6: A ação do servidor**

Antes de escrever, leia `node_modules/next/dist/docs/01-app/02-guides/forms.md` e `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`.

Crie `app/actions/pedido.ts`:

```ts
"use server";

import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { formulario } from "@/content/formulario";
import { destinoDoPedido, escolherTransporte, montarEmail } from "@/lib/email";
import { CAMPOS, pareceRobo, validarPedido, type ErrosPedido } from "@/lib/pedido";
import { SITE_URL } from "@/lib/site";

export type EstadoPedido =
  | { status: "inicial" }
  | { status: "invalido"; erros: ErrosPedido; valores: Record<string, string> }
  | { status: "falha"; valores: Record<string, string> }
  | { status: "enviado"; nome: string };

/** Só os campos visíveis, para preencher o formulário de novo depois de um erro. */
function valoresVisiveis(entrada: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    CAMPOS.map((campo) => {
      const valor = entrada[campo];
      return [campo, typeof valor === "string" ? valor : ""];
    }),
  );
}

/** Ação do formulário de pedido. Robô recebe sucesso sem envio, para não ganhar pista. */
export async function enviarPedido(_anterior: EstadoPedido, dados: FormData): Promise<EstadoPedido> {
  const entrada = Object.fromEntries(dados);
  const valores = valoresVisiveis(entrada);
  if (pareceRobo(entrada, Date.now())) return { status: "enviado", nome: valores.nome.trim() };

  const resultado = validarPedido(entrada, formulario);
  if (!resultado.ok) return { status: "invalido", erros: resultado.erros, valores };

  const email = montarEmail(resultado.pedido, destinoDoPedido(config, empresa), SITE_URL);
  const { ok } = await escolherTransporte()(email);
  return ok ? { status: "enviado", nome: resultado.pedido.nome } : { status: "falha", valores };
}
```

- [ ] **Passo 7: Rodar e ver passar**

Rode: `npm test && npm run typecheck`
Esperado: PASS em toda a bateria do Vitest, com os 3 arquivos novos, e nenhum erro de tipo.

- [ ] **Passo 8: Commit**

```bash
git add lib/pedido.ts lib/email.ts app/actions/pedido.ts content tests/unit
git commit -m "feat: pedido de orçamento com validação, antispam e transporte de e-mail

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 11: Formulário na tela e chamada final

**Arquivos:**
- Criar:
  - `components/contato/FormularioPedido.tsx` e `components/contato/pedido.css`;
  - `components/inicio/ChamadaFinal.tsx` e `components/inicio/chamada.css`.
- Modificar: `app/page.tsx`, `app/globals.css`
- Teste: `tests/e2e/formulario.spec.ts`

**Interfaces:**
- Consome:
  - `enviarPedido` e `EstadoPedido` (Tarefa 10);
  - `CAMPOS` (Tarefa 10);
  - `formulario` e `inicio.chamadaFinal` (Tarefa 2);
  - `preencher` (Tarefa 3);
  - `config` e `LinkWhatsapp` (Plano 1).
- Produz:
  - `FormularioPedido()` (cliente, sem props, reusado na Contato no Plano 3);
  - `ChamadaFinal()`, que gera `<section id="orcamento" class="chamada escuro">`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/formulario.spec.ts`:

```ts
import { expect, test, type Page } from "@playwright/test";

const SUCESSO_CONCEITO =
  "Mensagem recebida, Ana! Como este é um projeto conceito, ela chegou para Gustavo Walien, que fez este site.";

async function formulario(page: Page) {
  await page.goto("/");
  const form = page.locator("#orcamento form");
  await form.scrollIntoViewIfNeeded();
  return form;
}

/** Recua o carimbo de tempo, para o envio não parecer de robô (menos de 3 s). */
async function envelhecer(page: Page) {
  await page.locator('#orcamento input[name="inicio"]').evaluate((el) => {
    (el as HTMLInputElement).value = String(Date.now() - 10_000);
  });
}

async function preencher(page: Page, nome: string, whatsapp = "(65) 99999-8888") {
  const form = page.locator("#orcamento form");
  await form.getByLabel("Nome").fill(nome);
  await form.getByLabel("WhatsApp com DDD").fill(whatsapp);
  await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
  await form.getByRole("radio", { name: "Casa" }).check();
}

test.describe("formulário de pedido", () => {
  test("campos vazios mostram os erros, e o foco vai para o nome", async ({ page }) => {
    const form = await formulario(page);
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    const nome = form.getByLabel("Nome");
    await expect(form).toContainText("Coloque seu nome.");
    await expect(form).toContainText("Confira o número do WhatsApp, com DDD.");
    await expect(nome).toHaveAttribute("aria-invalid", "true");
    await expect(nome).toBeFocused();
  });

  test("pedido válido mostra o sucesso da versão conceito", async ({ page }) => {
    const form = await formulario(page);
    await expect(form).toContainText("Formulário de demonstração. A mensagem chega para quem fez este site.");
    await preencher(page, "Ana");
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento").getByRole("status")).toHaveText(SUCESSO_CONCEITO);
  });

  test("falha no envio mostra o alerta e mantém o que foi digitado", async ({ page }) => {
    const form = await formulario(page);
    await preencher(page, "Teste Falha");
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(form.getByRole("alert")).toHaveText(
      "Não conseguimos enviar agora. Tente de novo ou chame a gente no WhatsApp.",
    );
    await expect(form.getByLabel("Nome")).toHaveValue("Teste Falha");
  });

  test("corrigir um erro e reenviar logo em seguida não descarta o pedido como robô", async ({ page }) => {
    const form = await formulario(page);
    await page.waitForTimeout(3100);
    await preencher(page, "Teste Falha", "123");
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(form).toContainText("Confira o número do WhatsApp, com DDD.");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    // "Teste Falha" só dá falha se o pedido for enviado de verdade; como robô, daria sucesso falso
    await expect(form.getByRole("alert")).toBeVisible();
  });
});

test.describe("formulário sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("envia por POST nativo e mostra o sucesso", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#orcamento form");
    await form.getByLabel("Nome").fill("Ana");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
    await form.getByRole("radio", { name: "Casa" }).check();
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento")).toContainText(SUCESSO_CONCEITO);
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/formulario.spec.ts`
Esperado: FAIL nos 5 testes, porque não existe `#orcamento`.

- [ ] **Passo 3: O formulário**

Crie `components/contato/FormularioPedido.tsx`:

```tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { enviarPedido, type EstadoPedido } from "@/app/actions/pedido";
import { config } from "@/content/config";
import { formulario as t } from "@/content/formulario";
import type { CampoPedido } from "@/content/tipos";
import { CAMPOS } from "@/lib/pedido";
import { preencher } from "@/lib/texto";

const INICIAL: EstadoPedido = { status: "inicial" };

/** Formulário de pedido de orçamento. Funciona sem JavaScript (POST nativo); com ele, mostra erros e estados na hora. */
export function FormularioPedido() {
  const [estado, enviar, enviando] = useActionState(enviarPedido, INICIAL);
  const form = useRef<HTMLFormElement>(null);
  const carimbo = useRef<HTMLInputElement>(null);
  const apareceu = useRef(0);

  // O carimbo guarda a hora em que o formulário apareceu, e não a do último envio: quem corrige um erro e
  // reenvia logo em seguida não pode parecer robô. O React limpa o formulário depois de cada envio.
  useEffect(() => {
    if (!apareceu.current) apareceu.current = Date.now();
    if (carimbo.current) carimbo.current.value = String(apareceu.current);
  }, [estado]);

  useEffect(() => {
    if (estado.status !== "invalido") return;
    const primeiro = CAMPOS.find((campo) => estado.erros[campo]);
    if (primeiro) form.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
  }, [estado]);

  const valores = estado.status === "invalido" || estado.status === "falha" ? estado.valores : {};
  const erros = estado.status === "invalido" ? estado.erros : {};
  const enviado = estado.status === "enviado";

  const marcar = (campo: CampoPedido) => ({
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `pedido-${campo}-erro` : undefined,
  });
  const erro = (campo: CampoPedido) =>
    erros[campo] ? (
      <p className="pedido__erro" id={`pedido-${campo}-erro`}>
        {erros[campo]}
      </p>
    ) : null;

  return (
    <>
      <div className="pedido__status" role="status">
        {enviado && <p>{preencher(config.modoConceito ? t.sucessoConceito : t.sucesso, { nome: estado.nome })}</p>}
      </div>
      {!enviado && (
        <form ref={form} action={enviar} className="pedido" noValidate>
          <div className="pedido__campo">
            <label htmlFor="pedido-nome">{t.campos.nome}</label>
            <input
              id="pedido-nome"
              name="nome"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              defaultValue={valores.nome ?? ""}
              {...marcar("nome")}
            />
            {erro("nome")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-whatsapp">{t.campos.whatsapp}</label>
            <input
              id="pedido-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              defaultValue={valores.whatsapp ?? ""}
              {...marcar("whatsapp")}
            />
            {erro("whatsapp")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-cidade">
              {t.campos.cidade} <span className="pedido__opcional">({t.opcional})</span>
            </label>
            <input
              id="pedido-cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              maxLength={80}
              defaultValue={valores.cidade ?? ""}
              {...marcar("cidade")}
            />
            {erro("cidade")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-conta">{t.campos.conta}</label>
            <select id="pedido-conta" name="conta" required defaultValue={valores.conta ?? ""} {...marcar("conta")}>
              <option value="" disabled>
                {t.escolha}
              </option>
              {t.opcoesConta.map((opcao) => (
                <option key={opcao}>{opcao}</option>
              ))}
            </select>
            {erro("conta")}
          </div>
          <fieldset className="pedido__campo pedido__opcoes">
            <legend>{t.campos.onde}</legend>
            {t.opcoesOnde.map((opcao) => (
              <label key={opcao} className="pedido__opcao">
                <input
                  type="radio"
                  name="onde"
                  value={opcao}
                  required
                  defaultChecked={valores.onde === opcao}
                  {...marcar("onde")}
                />
                {opcao}
              </label>
            ))}
            {erro("onde")}
          </fieldset>
          <div className="pedido__campo">
            <label htmlFor="pedido-mensagem">
              {t.campos.mensagem} <span className="pedido__opcional">({t.opcional})</span>
            </label>
            <textarea
              id="pedido-mensagem"
              name="mensagem"
              rows={4}
              maxLength={1000}
              defaultValue={valores.mensagem ?? ""}
              {...marcar("mensagem")}
            />
            {erro("mensagem")}
          </div>
          <div className="pedido__armadilha" aria-hidden="true">
            <label htmlFor="pedido-site">Site</label>
            <input id="pedido-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input ref={carimbo} type="hidden" name="inicio" defaultValue="" />
          {estado.status === "falha" && (
            <p className="pedido__falha" role="alert">
              {t.erros.envio}
            </p>
          )}
          {config.modoConceito && <p className="pedido__aviso">{t.aviso}</p>}
          <button className="botao botao--ipe pedido__botao" type="submit" disabled={enviando}>
            {enviando ? t.enviando : t.botao}
          </button>
          <p className="pedido__privacidade">{t.privacidade}</p>
        </form>
      )}
    </>
  );
}
```

Crie `components/contato/pedido.css`:

```css
@layer components {
  .pedido {
    display: grid;
    gap: 16px;
  }
  .pedido__campo {
    display: grid;
    gap: 6px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .pedido__campo > label,
  .pedido__campo legend {
    font-weight: 600;
  }
  .pedido__opcional {
    font-weight: 400;
    color: var(--color-tinta-suave);
  }
  .pedido input:not([type="radio"]),
  .pedido select,
  .pedido textarea {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 14px;
    background: var(--color-papel);
  }
  .pedido textarea {
    resize: vertical;
  }
  .pedido [aria-invalid="true"] {
    border-color: var(--color-erro);
  }
  .pedido__opcoes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
  }
  .pedido__opcoes legend {
    margin-bottom: 6px;
  }
  .pedido__opcao {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 8px 14px;
    border: 2px solid var(--color-profundo);
    border-radius: 999px;
    cursor: pointer;
  }
  .pedido__opcao:has(input:checked) {
    background: var(--color-ipe);
  }
  .pedido__opcao input {
    width: 18px;
    height: 18px;
    accent-color: var(--color-profundo);
  }
  .pedido__erro {
    color: var(--color-erro);
    font-weight: 600;
    font-size: 0.95rem;
  }
  .pedido__opcoes .pedido__erro {
    width: 100%;
  }
  .pedido__falha {
    padding: 12px 14px;
    border: 2px solid var(--color-erro);
    border-radius: 12px;
    color: var(--color-erro);
    font-weight: 600;
  }
  .pedido__aviso,
  .pedido__privacidade {
    font-size: 0.9rem;
    color: var(--color-tinta-suave);
  }
  .pedido__botao {
    justify-self: start;
  }
  .pedido__botao:disabled {
    opacity: 0.7;
    cursor: progress;
  }
  .pedido__armadilha {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .pedido__status p {
    padding: 16px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 16px;
    background: var(--color-ceu-claro);
    font-weight: 600;
  }
}
```

- [ ] **Passo 4: A chamada final**

Crie `components/inicio/ChamadaFinal.tsx`:

```tsx
import { FormularioPedido } from "@/components/contato/FormularioPedido";
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { inicio } from "@/content/inicio";

const t = inicio.chamadaFinal;

/** Bloco azul-profundo do fim da página: o WhatsApp de um lado e o formulário do outro. */
export function ChamadaFinal() {
  return (
    <section id="orcamento" className="chamada escuro" aria-labelledby="orcamento-titulo">
      <div className="chamada__miolo">
        <div>
          <h2 id="orcamento-titulo" className="chamada__titulo">
            {t.titulo}
          </h2>
          <p className="chamada__apoio">{t.apoio}</p>
          <LinkWhatsapp className="botao botao--ipe">{t.botao}</LinkWhatsapp>
        </div>
        <div className="chamada__formulario">
          <p className="chamada__formulario-titulo">{t.formulario}</p>
          <FormularioPedido />
        </div>
      </div>
    </section>
  );
}
```

Crie `components/inicio/chamada.css`:

```css
@layer components {
  .chamada {
    padding: clamp(72px, 10vw, 128px) 16px;
    background: var(--color-profundo);
    color: var(--color-papel);
  }
  .chamada__miolo {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 48px;
    align-items: start;
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .chamada__titulo {
    max-width: 12ch;
    font-weight: 800;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    line-height: 1;
  }
  .chamada__apoio {
    max-width: 36ch;
    margin: 18px 0 28px;
    font-size: 1.15rem;
    color: var(--color-ceu-claro);
  }
  .chamada__formulario {
    padding: 28px;
    border: 2.5px solid var(--color-ipe);
    border-radius: 22px;
    background: var(--color-papel);
    color: var(--color-profundo);
    box-shadow: 0 6px 0 var(--color-ipe);
  }
  /* o cartão do formulário é claro, dentro do bloco escuro: o foco volta a ser azul */
  .chamada__formulario :focus-visible {
    outline-color: var(--color-profundo);
  }
  .chamada__formulario-titulo {
    margin-bottom: 18px;
    font-weight: 600;
  }
  @media (max-width: 860px) {
    .chamada__miolo {
      grid-template-columns: 1fr;
    }
    .chamada__formulario {
      padding: 20px;
    }
  }
}
```

- [ ] **Passo 5: Ligar na Início**

Em `app/globals.css`, acrescente depois do `@import "../components/inicio/perguntas.css";`:

```css
@import "../components/inicio/chamada.css";
@import "../components/contato/pedido.css";
```

Em `app/page.tsx`, acrescente o import de `ChamadaFinal` (de `@/components/inicio/ChamadaFinal`) e `<ChamadaFinal />` depois de `<Perguntas />`.

- [ ] **Passo 6: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/formulario.spec.ts tests/e2e/base.spec.ts tests/e2e/secoes.spec.ts`
Esperado: PASS nos dois projetos.

Se o teste sem JavaScript falhar porque o POST nativo não chega à ação ou não volta com o estado, siga superpowers:systematic-debugging antes de mudar qualquer coisa:
- leia de novo `forms.md` e `server-actions.md`;
- confira o `useActionState` com o terceiro argumento `permalink` (`"/#orcamento"`);
- confira se o `ensureStatic = "navigation"` aceita a resposta do POST.

A spec exige o envio sem JavaScript (seção 8). Registre o que achar no ledger antes de decidir.

- [ ] **Passo 7: Commit**

```bash
git add components/contato components/inicio app/page.tsx app/globals.css tests/e2e/formulario.spec.ts
git commit -m "feat: chamada final com o formulário de pedido

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 12: Verificação final e entrega para revisão

**Arquivos:**
- Modificar: `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, no registro de progresso. É outro repositório, e fica sem commit.

**Interfaces:**
- Consome: tudo das Tarefas 1 a 11.
- Produz: a branch `feat/inicio` verde e enviada ao GitHub, pronta para a revisão final.

- [ ] **Passo 1: Lint e tipos**

Rode: `npm run lint && npm run typecheck`
Esperado: nenhum erro.

- [ ] **Passo 2: Todos os testes**

Rode: `npm run test:all`
Esperado: todos os testes do Vitest e do Playwright passam nos projetos `desktop` e `mobile`.

- [ ] **Passo 3: Build todo estático**

Rode: `npm run build`
Esperado:
- o build termina sem erro;
- a tabela de rotas mostra `/`, `/servicos`, `/servicos/[slug]` (4 páginas), `/sobre`, `/blog` e `/contato` como estáticas;
- a ação do formulário aparece como função do servidor, o que é esperado.

- [ ] **Passo 4: Conferir com os próprios olhos**

Com o `npm run dev` rodando, abra http://localhost:3000 no computador e com a janela estreita (375 px). Confira:
- o hero inteiro, até o meio-dia;
- a barra e o botão flutuante;
- o simulador;
- o caminho do sol em "Como funciona";
- as perguntas;
- o formulário, enviando com um nome qualquer.

Sem `EMAIL_TRANSPORTE=teste` no `next dev`, o envio mostra a mensagem de falha. É o esperado até o Plano 5. Para ver o sucesso, rode `EMAIL_TRANSPORTE=teste npm run dev`.

Mande o link ao usuário no próprio chat, numa linha só, e faça a pergunta de aprovação no fim da mensagem, sem janela de pergunta.

- [ ] **Passo 5: Enviar a branch e registrar no portfólio**

Rode: `git push -u origin feat/inicio`

Em `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, acrescente ao fim da tabela "Registro de progresso" uma linha com a data de hoje (DD/MM/AAAA):

```markdown
| DD/MM/AAAA | Site de negócio local | Plano 2 (Início) executado: hero cartoon guiado pelo scroll, seções, simulador de economia, perguntas e formulário de pedido (e-mail real no Plano 5). |
```

Não faça commit nesse arquivo sem pedido do usuário.
