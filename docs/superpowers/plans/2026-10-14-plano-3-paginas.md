# Plano 3 (Páginas): plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar o progresso.

**Objetivo:** trocar as páginas provisórias "Em construção" pelas de verdade:
- a lista de serviços e as 4 páginas de serviço;
- a Sobre, com a história, os números, a equipe em retratos ilustrados e as cidades atendidas;
- a Contato, com o WhatsApp, o horário, o mapa e o formulário;
- a página 404 "Essa página tomou sombra".

**Arquitetura:**
- **Conteúdo:**
  - os textos vêm de `docs/textos.md` e moram em `content/`: `servicos.ts` ganha o conteúdo das páginas, e nascem `equipe.ts` e `paginas.ts`;
  - os metadados de cada página saem de um objeto `Seo` por uma função pura (`lib/seo.ts`).
- **Componentes:** todas as páginas são de servidor e reaproveitam o que já existe:
  - `Secao`, `ChamadaFinal` (com o `FormularioPedido`) e `LinkWhatsapp`;
  - as classes `.pergunta`.

  O único componente cliente novo é o `Mapa`. Ele mostra um mapa desenhado em SVG e só carrega o iframe do Google quando chega a 300 px da tela.
- **Rotas:**
  - `/servicos/[slug]` usa `generateStaticParams`;
  - um endereço fora da lista cai no `notFound()`, porque o Next 16 não aceita `dynamicParams` com `cacheComponents`;
  - a 404 é o `app/not-found.tsx`.

**Stack:** Next.js 16.4, React 19.3, TypeScript, Tailwind CSS 4 pelo PostCSS, Vitest 5.0.3, Playwright 1.64.0.

**Spec:** [docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md](../specs/2026-10-13-site-ipe-solar-design.md). Este plano cobre:
- a seção 3 (rotas de serviço, Sobre, Contato e 404);
- a seção 9 (mapa);
- da seção 11, o título e a descrição de cada página. Canônico, Open Graph por página e dados estruturados são do Plano 5;
- as seções 13 e 14, nas páginas novas.

Textos em [docs/textos.md](../../textos.md), seções 4 a 6.

## Roteiro dos planos

| Plano | O quê | Situação |
|---|---|---|
| 1. Fundação | Testes, cores, fontes, conteúdo, barra placa, rodapé, WhatsApp e aviso | feito, na `main` |
| 2. Início | Hero, seções, simulador, perguntas, formulário com transporte de e-mail | feito, na `main` |
| **3. Páginas (este)** | Serviços (lista e 4 páginas), Sobre com equipe ilustrada, Contato com mapa e formulário, 404 | |
| 4. Blog | MDX, 3 artigos completos, capas, imagens de compartilhamento por artigo | |
| 5. Google e publicação | Dados estruturados, sitemap, robots, imagem da Início, Lighthouse, Vercel, Resend, README, `CONTEUDO.md`, portfólio | |

## Restrições globais

- **Dos Planos 1 e 2, valem todas:**
  - ler o guia em `node_modules/next/dist/docs/` antes de usar uma API do Next;
  - `ensureStatic = "navigation"`, com nada renderizando por visita;
  - só português do Brasil;
  - a paleta do `@theme static`;
  - as três fontes;
  - contorno de 2,5 px `profundo`, sombra dura e raio de 16 a 22 px;
  - foco `profundo` no claro e `ipe` no escuro;
  - contraste de 4,5:1;
  - alvos de 44 px no celular;
  - um H1 por página;
  - só `transform` e `opacity` animam;
  - todo texto visível em `content/`, passando pelo portão de texto;
  - testes com `npm test`, `npm run test:e2e` e `npm run test:all`.
- **Lições do Plano 2:**
  - o Next 16 recusa `dynamicParams` junto com `cacheComponents`;
  - o Next 16 guarda páginas escondidas no DOM (Activity, com `display: none`) depois de uma navegação. Um seletor que procura um elemento de outra página precisa ignorar os escondidos;
  - o teste de desempenho roda sozinho no projeto `desempenho`;
  - o `FormularioPedido` usa ids fixos (`pedido-nome`…), então só pode haver um formulário por página.
- **Git:** o trabalho acontece na branch `feat/paginas`, criada a partir da `main`. Cada tarefa termina em pelo menos um commit, e toda mensagem termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. O usuário autorizou o envio ao GitHub.
- **Modo conceito:**
  - nada de telefone nem endereço de rua inventados (spec, seção 2);
  - o bloco de telefone da Contato só aparece quando `empresa.telefone` tem número;
  - o mapa usa a consulta `Cuiabá, MT`, sem pino num endereço real.
- **SEO:**
  - o conteúdo guarda o título sem o sufixo, e o modelo do layout acrescenta " | Ipê Solar";
  - títulos que já trazem a marca (Sobre e Contato) usam `title.absolute`;
  - título final de até 60 caracteres e descrição de até 160.
- **Mapa no teste:** os testes de ponta a ponta nunca carregam o Google de verdade. Toda chamada a `https://www.google.com/**` é atendida por `page.route` com uma página vazia.

## Foco da revisão

1. **Endereço de serviço ou página que não existe:** responde 404 e mostra "Essa página tomou sombra." com o link para a Início, e não uma página vazia nem o 404 padrão em inglês. Teste na Tarefa 5.
2. **Visitante sem JavaScript na Contato:**
   - vê o mapa desenhado e o link "Abrir no Google Maps", sem iframe;
   - o formulário envia por POST nativo.

   Teste na Tarefa 4.
3. **Mapa:**
   - o iframe só entra quando o cartão chega perto da tela;
   - o cartão tem a mesma altura antes e depois do iframe, para nada pular;
   - se o Google não responder, o link alternativo continua lá.

   Teste na Tarefa 4.
4. **Cliente real com telefone preenchido:** o bloco de telefone aparece com o link `tel:` certo. No modo conceito, sem número, ele não aparece. Teste na Tarefa 4.
5. **Todas as páginas novas:**
   - um H1 só;
   - título até 60 caracteres e descrição até 160;
   - nenhum erro no console;
   - nada saindo pela direita em 375 px.

   Teste na Tarefa 5.

## Estrutura de arquivos

```
content/tipos.ts                         tipos novos: Seo, BlocoServico, Servico (ampliado), RetratoMembro, Membro, TextosPaginas; Empresa.telefone (modificar)
content/servicos.ts                      conteúdo das 4 páginas de serviço (modificar)
content/equipe.ts · paginas.ts           equipe da Sobre; textos da lista de serviços, Sobre, Contato e 404 (criar)
content/empresa.ts                       telefone vazio (modificar)
lib/seo.ts                               metadados(seo) e tituloFinal(seo, marca)
components/ui/CabecalhoPagina.tsx        abertura das páginas internas: trilha, rótulo, H1 e apoio (+ cabecalho.css)
components/ui/ListaPerguntas.tsx         details/summary das perguntas, usado na Início e nos serviços
components/servicos/CartaoServico.tsx    cartão de serviço, usado na Início e na lista
components/servicos/PaginaServico.tsx    página de um serviço (+ servico.css)
components/sobre/Retrato.tsx · Equipe.tsx  retratos ilustrados e a equipe (+ sobre.css)
components/contato/MapaDesenhado.tsx     mapa ilustrado em SVG (Sobre e Contato)
components/contato/Mapa.tsx              cartão do mapa com o iframe preguiçoso, cliente (+ mapa.css)
components/contato/BlocosContato.tsx     WhatsApp, telefone, horário e local (+ contato.css)
components/erro/IlustracaoSombra.tsx     desenho da 404 (+ nao-encontrada.css)
components/inicio/OQueFazemos.tsx · Perguntas.tsx   passam a usar CartaoServico e ListaPerguntas (modificar)
app/servicos/page.tsx · app/servicos/[slug]/page.tsx · app/sobre/page.tsx · app/contato/page.tsx   (reescrever)
app/not-found.tsx                        404 (criar)
app/globals.css                          imports novos (modificar)
tests/unit/conteudo-paginas.test.ts · seo.test.ts
tests/unit/contato.test.ts · modo-desligado.test.tsx   telefone (modificar)
tests/e2e/servicos.spec.ts · sobre.spec.ts · contato.spec.ts · rotas.spec.ts
tests/e2e/secoes.spec.ts                 H1 novo da página de serviço (modificar)
```

---

### Tarefa 1: Conteúdo das páginas e metadados

**Arquivos:**
- Modificar: `content/tipos.ts`, `content/servicos.ts`, `content/empresa.ts`, `tests/unit/contato.test.ts`
- Criar: `content/equipe.ts`, `content/paginas.ts`, `lib/seo.ts`
- Teste: `tests/unit/conteudo-paginas.test.ts`, `tests/unit/seo.test.ts`

**Interfaces:**
- Consome: `Servico`, `Pergunta` e `Empresa` (Planos 1 e 2).
- Produz:
  - os tipos `Seo`, `BlocoServico`, `RetratoMembro`, `Membro` e `TextosPaginas`;
  - `Servico` ampliado com `seo`, `h1`, `abertura`, `incluido`, `extra` e `perguntas`;
  - `Empresa.telefone: string`;
  - os objetos `equipe: Membro[]` e `paginas: TextosPaginas`;
  - `metadados(seo: Seo): Metadata` e `tituloFinal(seo: Seo, marca: string): string`.

- [ ] **Passo 1: Criar a branch**

Rode: `git switch main && git pull && git switch -c feat/paginas`
Esperado: `Switched to a new branch 'feat/paginas'`.

- [ ] **Passo 2: Escrever os testes que falham**

Crie `tests/unit/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { metadados, tituloFinal } from "@/lib/seo";

describe("seo", () => {
  it("título comum ganha o sufixo do modelo do layout", () => {
    const seo = { titulo: "Energia solar rural em Mato Grosso", descricao: "Texto." };
    expect(metadados(seo)).toEqual({ title: "Energia solar rural em Mato Grosso", description: "Texto." });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Energia solar rural em Mato Grosso | Ipê Solar");
  });

  it("título absoluto ignora o modelo, porque já traz a marca", () => {
    const seo = { titulo: "Contato | Ipê Solar Cuiabá", descricao: "Texto.", absoluto: true };
    expect(metadados(seo)).toEqual({ title: { absolute: "Contato | Ipê Solar Cuiabá" }, description: "Texto." });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Contato | Ipê Solar Cuiabá");
  });
});
```

Crie `tests/unit/conteudo-paginas.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { empresa } from "@/content/empresa";
import { equipe } from "@/content/equipe";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import type { Seo } from "@/content/tipos";
import { tituloFinal } from "@/lib/seo";

function conferirSeo(seo: Seo) {
  expect(tituloFinal(seo, empresa.nome).length).toBeLessThanOrEqual(60);
  expect(seo.descricao.length).toBeGreaterThanOrEqual(50);
  expect(seo.descricao.length).toBeLessThanOrEqual(160);
}

describe("conteúdo das páginas", () => {
  it.each(servicos.map((s) => [s.slug, s] as const))("%s: SEO, H1, listas e perguntas completos", (_, s) => {
    conferirSeo(s.seo);
    expect(s.h1.length).toBeGreaterThan(10);
    expect(s.abertura.length).toBeGreaterThan(80);
    expect(s.incluido.itens.length).toBeGreaterThanOrEqual(3);
    expect(s.extra.itens.length).toBeGreaterThanOrEqual(2);
    expect(s.perguntas.length).toBeGreaterThanOrEqual(2);
  });

  it("os títulos SEO dos serviços seguem docs/textos.md", () => {
    expect(servicos.map((s) => tituloFinal(s.seo, empresa.nome))).toEqual([
      "Energia solar residencial em Cuiabá | Ipê Solar",
      "Energia solar para empresas em Cuiabá | Ipê Solar",
      "Energia solar rural em Mato Grosso | Ipê Solar",
      "Limpeza de placas solares em Cuiabá | Ipê Solar",
    ]);
  });

  it("lista de serviços, Sobre, Contato e 404 com SEO no tamanho", () => {
    for (const seo of [paginas.servicos.seo, paginas.sobre.seo, paginas.contato.seo, paginas.naoEncontrada.seo]) {
      conferirSeo(seo);
    }
    expect(tituloFinal(paginas.sobre.seo, empresa.nome)).toBe("Sobre a Ipê Solar | Energia solar em Cuiabá");
    expect(tituloFinal(paginas.contato.seo, empresa.nome)).toBe("Contato | Ipê Solar Cuiabá");
  });

  it("a equipe tem quatro pessoas com nomes e retratos diferentes", () => {
    expect(equipe.map((m) => m.nome)).toEqual(["Marina Duarte", "Paulo Arruda", "Luana Campos", "Tião Moraes"]);
    expect(new Set(equipe.map((m) => JSON.stringify(m.retrato))).size).toBe(4);
  });

  it("o modelo de mensagem do serviço tem onde pôr o nome do serviço", () => {
    expect(paginas.servico.mensagem).toContain("{servico}");
  });

  it("no modo conceito não há telefone inventado", () => {
    expect(empresa.telefone).toBe("");
  });
});
```

- [ ] **Passo 3: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/seo.test.ts tests/unit/conteudo-paginas.test.ts`
Esperado: FAIL com "Cannot find package '@/lib/seo'" e "'@/content/equipe'".

- [ ] **Passo 4: Os tipos**

Em `content/tipos.ts`:
- no tipo `Empresa`, acrescente depois de `remetente: string;`:

  ```ts
    /** Telefone fixo da empresa, com DDD. Vazio no modo conceito (sem número inventado); vazio, o bloco some. */
    telefone: string;
  ```

- troque o tipo `Servico` inteiro por:

```ts
/** Título e descrição de uma página. Com `absoluto`, o título ignora o sufixo " | Ipê Solar" do layout. */
export type Seo = { titulo: string; descricao: string; absoluto?: boolean };

export type BlocoServico = { titulo: string; itens: string[] };

export type Servico = {
  slug: string;
  /** Nome do serviço, usado no link do cartão e na trilha. Ex.: "Energia solar para casa". */
  nome: string;
  icone: IconeServico;
  cartao: { titulo: string; texto: string };
  seo: Seo;
  h1: string;
  abertura: string;
  /** "O que está incluído" (ou "O que a gente faz"). */
  incluido: BlocoServico;
  /** O bloco que muda de serviço para serviço: "Faz mais sentido se", "Para quem", "Usos" ou "Planos". */
  extra: BlocoServico;
  perguntas: Pergunta[];
};
```

- no fim do arquivo, acrescente:

```ts
export type RetratoMembro = {
  pele: string;
  cabelo: "curto" | "longo" | "coque";
  corCabelo: string;
  roupa: string;
  acessorio?: "capacete" | "oculos" | "bone";
};

export type Membro = { nome: string; cargo: string; texto: string; retrato: RetratoMembro };

export type TextosPaginas = {
  servicos: { seo: Seo; rotulo: string; titulo: string; apoio: string };
  servico: {
    trilhaInicio: string;
    trilhaServicos: string;
    botao: string;
    /** "{servico}" vira o nome do serviço em minúsculas. */
    mensagem: string;
    perguntas: string;
  };
  sobre: {
    seo: Seo;
    rotulo: string;
    titulo: string;
    historia: string;
    numerosTitulo: string;
    equipeTitulo: string;
    ondeTitulo: string;
    ondeApoio: string;
  };
  contato: {
    seo: Seo;
    titulo: string;
    apoio: string;
    blocosRotulo: string;
    whatsappTitulo: string;
    whatsappTexto: string;
    whatsappBotao: string;
    telefone: string;
    horario: string;
    local: string;
    mapaTitulo: string;
    abrirMapa: string;
  };
  naoEncontrada: { seo: Seo; titulo: string; texto: string; botao: string };
};
```

Em `content/empresa.ts`, acrescente `telefone: "",` depois de `remetente: "",`.

Em `tests/unit/contato.test.ts`, no objeto de exemplo da empresa, acrescente `telefone: "",` depois de `remetente: "",` (o tipo novo exige o campo).

- [ ] **Passo 5: O conteúdo**

Troque `content/servicos.ts` por:

```ts
import type { Servico } from "./tipos";

/** Os serviços da empresa: os cartões da Início e as páginas /servicos/{slug} (docs/textos.md, seção 4). */
export const servicos: Servico[] = [
  {
    slug: "energia-solar-residencial",
    nome: "Energia solar para casa",
    icone: "casa",
    cartao: {
      titulo: "Ar ligado sem medo da conta.",
      texto: "Um sistema do tamanho do seu consumo, com app para ver quanto a casa gera por dia.",
    },
    seo: {
      titulo: "Energia solar residencial em Cuiabá",
      descricao:
        "Placas solares para casa em Cuiabá e Várzea Grande: projeto, instalação e liberação na Energisa. Simule sua economia e peça orçamento.",
    },
    h1: "Energia solar para casa em Cuiabá",
    abertura:
      "Em Cuiabá, o ar-condicionado é o que mais pesa na conta. Um sistema bem dimensionado gera de dia a energia que a casa usa e manda o que sobra para a Energisa. Essa sobra vira crédito para a noite e para os meses de chuva.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Visita técnica e projeto assinado por engenheiro",
        "Placas e inversor com garantia por escrito",
        "Instalação com fotos do telhado antes e depois",
        "Pedido de liberação na Energisa",
        "App para acompanhar a geração",
        "Suporte depois da instalação",
      ],
    },
    extra: {
      titulo: "Faz mais sentido se",
      itens: [
        "Sua conta passa de R$ 250 por mês (referência do projeto conceito)",
        "O telhado pega sol boa parte do dia",
        "Você pretende ficar no imóvel por alguns anos",
      ],
    },
    perguntas: [
      {
        pergunta: "Dá para instalar em telha de fibrocimento?",
        resposta: "Dá, com suporte próprio para esse tipo de telha. Na visita a gente confere a estrutura.",
      },
      {
        pergunta: "E se eu aumentar o consumo depois?",
        resposta:
          "Dá para acrescentar placas mais tarde, se o inversor e o telhado comportarem. Por isso o projeto já considera planos como comprar outro ar-condicionado.",
      },
    ],
  },
  {
    slug: "energia-solar-para-empresas",
    nome: "Energia solar para empresas",
    icone: "empresa",
    cartao: {
      titulo: "Conta menor, margem maior.",
      texto: "Comércios, clínicas e escritórios gastam energia de dia, justamente quando as placas geram.",
    },
    seo: {
      titulo: "Energia solar para empresas em Cuiabá",
      descricao:
        "Energia solar para comércios, clínicas, escolas e indústrias em Cuiabá. Quem consome de dia aproveita a energia na hora. Peça um estudo de economia.",
    },
    h1: "Energia solar para empresas em Cuiabá",
    abertura:
      "Quem trabalha de dia usa a energia na mesma hora em que as placas geram. Essa energia não passa pela rede, fica fora da cobrança do Fio B, e a economia aparece mais rápido.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Estudo de consumo com as últimas 12 contas",
        "Projeto com ART de engenheiro",
        "Instalação planejada para não parar o seu negócio",
        "Monitoramento e relatório mensal de geração",
      ],
    },
    extra: {
      titulo: "Para quem",
      itens: [
        "Comércio e lojas",
        "Clínicas e consultórios",
        "Escolas e academias",
        "Supermercados e padarias",
        "Oficinas e pequenas indústrias",
      ],
    },
    perguntas: [
      {
        pergunta: "A empresa pode financiar?",
        resposta:
          "Pode. Há linhas de crédito para energia solar em bancos e cooperativas, e o projeto já sai com os documentos que eles pedem.",
      },
      {
        pergunta: "Precisamos parar o expediente na instalação?",
        resposta: "Quase nunca. A troca de ligação leva algumas horas, e a gente combina o melhor horário.",
      },
    ],
  },
  {
    slug: "energia-solar-rural",
    nome: "Energia solar rural",
    icone: "campo",
    cartao: {
      titulo: "Pivô, bomba e ordenha no sol.",
      texto: "Placas no telhado do galpão ou no chão, com projeto pronto para financiamento rural.",
    },
    seo: {
      titulo: "Energia solar rural em Mato Grosso",
      descricao:
        "Energia solar para fazendas e sítios em Mato Grosso: irrigação, bombas, ordenha e galpões. Projeto pronto para financiamento rural.",
    },
    h1: "Energia solar para fazenda e sítio",
    abertura:
      "No campo, energia é custo de produção. Irrigação, bombas, ordenha e resfriamento funcionam todo dia. Com placas no telhado do galpão ou no chão, a propriedade gera a própria energia e a conta fica previsível.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Estudo das contas de todas as unidades da propriedade",
        "Sistema em solo ou no telhado",
        "Documentação para crédito rural (FCO Rural e linhas de bancos e cooperativas)",
        "Monitoramento à distância",
      ],
    },
    extra: {
      titulo: "Usos",
      itens: [
        "Irrigação e pivô central",
        "Bombeamento de água",
        "Ordenha e resfriador de leite",
        "Galpões, armazéns e secadores",
        "Casa da sede",
      ],
    },
    perguntas: [
      {
        pergunta: "O sistema resolve a falta de energia na fazenda?",
        resposta:
          "Sozinho, não. Por segurança, o sistema ligado à rede desliga quando a energia da rede cai. Para isso existe o sistema com bateria, que a gente também projeta.",
      },
      {
        pergunta: "Dá para usar a energia da fazenda em outra conta?",
        resposta:
          "Dá. Os créditos podem abater outras contas no seu nome dentro da área da Energisa. Isso se chama autoconsumo remoto.",
      },
    ],
  },
  {
    slug: "limpeza-de-placas-solares",
    nome: "Limpeza de placas",
    icone: "limpeza",
    cartao: {
      titulo: "Placa suja gera menos.",
      texto: "Na seca, poeira e fuligem das queimadas cobrem as placas. A limpeza devolve a geração.",
    },
    seo: {
      titulo: "Limpeza de placas solares em Cuiabá",
      descricao:
        "Limpeza e manutenção de placas solares em Cuiabá. Na seca, poeira e fuligem derrubam a geração. Atendemos sistemas de qualquer instaladora.",
    },
    h1: "Limpeza e manutenção de placas solares em Cuiabá",
    abertura:
      "De agosto a setembro, a seca e as queimadas deixam poeira e fuligem sobre as placas. A sujeira tapa a luz, e o sistema gera menos mesmo com sol forte.",
    incluido: {
      titulo: "O que a gente faz",
      itens: [
        "Limpeza com água e escova macia, sem produto que risque o vidro",
        "Inspeção de cabos, conectores e fixação no telhado",
        "Checagem do inversor e da geração no app",
        "Relatório com fotos antes e depois",
      ],
    },
    extra: {
      titulo: "Planos",
      itens: [
        "Limpeza avulsa, quando você precisar",
        "Plano anual com duas visitas: uma antes da seca e outra no meio dela",
      ],
    },
    perguntas: [
      {
        pergunta: "Posso limpar sozinho?",
        resposta:
          "Se as placas estão ao alcance do chão, pode. Use só água e pano ou escova macia, de manhã cedo ou no fim da tarde. Em telhado, chame quem tem equipamento de segurança.",
      },
      {
        pergunta: "Vocês atendem sistema instalado por outra empresa?",
        resposta: "Atendemos. A gente faz um check-up e mostra o que está bem e o que precisa de ajuste.",
      },
    ],
  },
];
```

Crie `content/equipe.ts`:

```ts
import type { Membro } from "./tipos";

/** A equipe da Sobre, com retratos ilustrados no estilo do hero (sem fotos de pessoas reais). */
export const equipe: Membro[] = [
  {
    nome: "Marina Duarte",
    cargo: "Engenheira eletricista e fundadora",
    texto: "Assina todos os projetos. Gosta de explicar conta de luz até a pessoa entender de verdade.",
    retrato: { pele: "#C98B62", cabelo: "longo", corCabelo: "#2B1D16", roupa: "#3FA2DB" },
  },
  {
    nome: "Paulo Arruda",
    cargo: "Líder de instalação",
    texto: "Doze anos em cima de telhado. Fotografa tudo antes de mexer em uma telha.",
    retrato: { pele: "#8D5A3B", cabelo: "curto", corCabelo: "#1B1410", roupa: "#E2683C", acessorio: "capacete" },
  },
  {
    nome: "Luana Campos",
    cargo: "Projetista",
    texto: "Calcula sombra, inclinação e quantas placas cabem. Não suporta espaço desperdiçado.",
    retrato: { pele: "#E7B48F", cabelo: "coque", corCabelo: "#6B3A1F", roupa: "#1E4D3A", acessorio: "oculos" },
  },
  {
    nome: "Tião Moraes",
    cargo: "Manutenção e limpeza",
    texto: "Conhece o barulho de cada inversor. É quem aparece quando o app avisa que algo parou.",
    retrato: { pele: "#A86B45", cabelo: "curto", corCabelo: "#9AA3AB", roupa: "#3FA2DB", acessorio: "bone" },
  },
];
```

Crie `content/paginas.ts`:

```ts
import type { TextosPaginas } from "./tipos";

/** Textos da lista de serviços, da página de serviço, da Sobre, da Contato e da 404 (docs/textos.md, seções 4 a 6). */
export const paginas: TextosPaginas = {
  servicos: {
    seo: {
      titulo: "Serviços de energia solar em Cuiabá",
      descricao:
        "Energia solar para casas, empresas e fazendas em Cuiabá e região, e limpeza de placas. Veja o que está incluído em cada serviço e peça seu orçamento.",
    },
    rotulo: "Serviços",
    titulo: "Escolha o serviço que cabe no seu telhado.",
    apoio:
      "Casa, empresa, fazenda ou só a limpeza das placas. Em cada página você vê o que está incluído e as dúvidas mais comuns.",
  },
  servico: {
    trilhaInicio: "Início",
    trilhaServicos: "Serviços",
    botao: "Peça seu orçamento",
    mensagem: "Olá! Vi a página de {servico} e quero um orçamento.",
    perguntas: "Perguntas sobre este serviço",
  },
  sobre: {
    seo: {
      titulo: "Sobre a Ipê Solar | Energia solar em Cuiabá",
      descricao:
        "A Ipê Solar nasceu em 2016 no Coxipó. Hoje são 18 pessoas cuidando de energia solar em Cuiabá e região. Conheça a história, os números e a equipe.",
      absoluto: true,
    },
    rotulo: "Sobre a Ipê Solar",
    titulo: "Gente de Cuiabá cuidando do seu telhado.",
    historia:
      "A Ipê Solar começou em 2016, numa garagem no Coxipó, com dois eletricistas e uma ideia simples: se o sol de Cuiabá castiga, ele também pode pagar a conta. O nome veio do ipê-amarelo, que floresce no auge da seca, quando o sol está mais forte. Hoje somos 18 pessoas, entre engenheiros, projetistas e instaladores.",
    numerosTitulo: "A Ipê Solar em números",
    equipeTitulo: "Quem cuida do seu projeto",
    ondeTitulo: "Onde atendemos",
    ondeApoio: "Cuiabá e as cidades da Baixada Cuiabana. Mora mais longe? Chame no WhatsApp que a gente avalia.",
  },
  contato: {
    seo: {
      titulo: "Contato | Ipê Solar Cuiabá",
      descricao:
        "Fale com a Ipê Solar pelo WhatsApp ou deixe seus dados no formulário. Atendimento em Cuiabá e região, de segunda a sábado, com visita marcada.",
      absoluto: true,
    },
    titulo: "Fale com a gente.",
    apoio: "O jeito mais rápido é o WhatsApp. Se preferir, deixe seus dados no formulário que a gente liga.",
    blocosRotulo: "Formas de contato",
    whatsappTitulo: "WhatsApp",
    whatsappTexto: "Mande uma foto da conta de luz e a gente responde com uma estimativa.",
    whatsappBotao: "Chamar no WhatsApp",
    telefone: "Telefone",
    horario: "Horário",
    local: "Onde estamos",
    mapaTitulo: "Mapa de Cuiabá, MT",
    abrirMapa: "Abrir no Google Maps",
  },
  naoEncontrada: {
    seo: {
      titulo: "Página não encontrada",
      descricao: "Essa página não existe mais ou mudou de endereço. Volte para a Início da Ipê Solar, energia solar em Cuiabá.",
    },
    titulo: "Essa página tomou sombra.",
    texto: "O endereço pode ter mudado ou nunca ter existido. A Início está logo ali, no sol.",
    botao: "Voltar para a Início",
  },
};
```

Crie `lib/seo.ts`:

```ts
import type { Metadata } from "next";
import type { Seo } from "@/content/tipos";

/** Título e descrição de uma página. O título absoluto ignora o sufixo " | {marca}" do layout. */
export function metadados(seo: Seo): Metadata {
  return { title: seo.absoluto ? { absolute: seo.titulo } : seo.titulo, description: seo.descricao };
}

/** O título como aparece na aba e no Google. */
export function tituloFinal(seo: Seo, marca: string): string {
  return seo.absoluto ? seo.titulo : `${seo.titulo} | ${marca}`;
}
```

- [ ] **Passo 6: Rodar e ver passar**

Rode: `npm test && npm run typecheck`
Esperado:
- PASS em toda a bateria;
- o portão de texto confere `equipe.ts` e `paginas.ts`;
- nenhum erro de tipo.

- [ ] **Passo 7: Commit**

```bash
git add content lib/seo.ts tests/unit
git commit -m "feat: conteúdo das páginas de serviço, Sobre, Contato e 404

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 2: Lista de serviços e página de cada serviço

**Arquivos:**
- Criar:
  - `components/ui/CabecalhoPagina.tsx` e `components/ui/cabecalho.css`;
  - `components/ui/ListaPerguntas.tsx`;
  - `components/servicos/CartaoServico.tsx`, `components/servicos/PaginaServico.tsx` e `components/servicos/servico.css`.
- Modificar:
  - `components/inicio/OQueFazemos.tsx`, `components/inicio/Perguntas.tsx`;
  - `app/servicos/page.tsx`, `app/servicos/[slug]/page.tsx`, `app/globals.css`;
  - `tests/e2e/secoes.spec.ts`.
- Teste: `tests/e2e/servicos.spec.ts`

**Interfaces:**
- Consome:
  - `servicos`, `paginas`, `metadados` e `preencher` (Tarefa 1 e Plano 2);
  - `Secao`, `Rotulo`, `ChamadaFinal`, `LinkWhatsapp` e `IconeServico`.
- Produz:
  - `CabecalhoPagina({ titulo, rotulo?, apoio?, trilha?, children? })`, com `ItemTrilha = { rotulo: string; href?: string }`. Gera `div.cabecalho` com `nav[aria-label="Trilha"]` e o H1 da página;
  - `ListaPerguntas({ perguntas })`;
  - `CartaoServico({ servico, nivel })`, com `nivel` "h2" ou "h3";
  - `PaginaServico({ servico })`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/servicos.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const PAGINAS = [
  ["energia-solar-residencial", "Energia solar para casa em Cuiabá", "Energia solar residencial em Cuiabá | Ipê Solar", 6, "Faz mais sentido se"],
  ["energia-solar-para-empresas", "Energia solar para empresas em Cuiabá", "Energia solar para empresas em Cuiabá | Ipê Solar", 4, "Para quem"],
  ["energia-solar-rural", "Energia solar para fazenda e sítio", "Energia solar rural em Mato Grosso | Ipê Solar", 4, "Usos"],
  ["limpeza-de-placas-solares", "Limpeza e manutenção de placas solares em Cuiabá", "Limpeza de placas solares em Cuiabá | Ipê Solar", 4, "Planos"],
] as const;

test.describe("serviços", () => {
  test("a lista mostra os quatro serviços com link para cada página", async ({ page }) => {
    await page.goto("/servicos");
    await expect(page).toHaveTitle("Serviços de energia solar em Cuiabá | Ipê Solar");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Escolha o serviço que cabe no seu telhado.");
    const lista = page.locator("main .fazemos__lista");
    await expect(lista.getByRole("heading", { level: 2 })).toHaveCount(4);
    await expect(lista.getByRole("link", { name: "Energia solar rural" })).toHaveAttribute(
      "href",
      "/servicos/energia-solar-rural",
    );
  });

  for (const [slug, h1, titulo, incluidos, extra] of PAGINAS) {
    test(`/servicos/${slug}: título, H1, trilha, listas, perguntas e orçamento`, async ({ page }) => {
      await page.goto(`/servicos/${slug}`);
      await expect(page).toHaveTitle(titulo);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      const trilha = page.getByRole("navigation", { name: "Trilha" });
      await expect(trilha.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
      await expect(trilha.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/servicos");
      await expect(page.locator("#incluido li")).toHaveCount(incluidos);
      await expect(page.locator("#extra").getByRole("heading", { level: 2 })).toHaveText(extra);
      await expect(page.locator("#perguntas details")).toHaveCount(2);
      const orcamento = page.locator(".cabecalho").getByRole("link", { name: "Peça seu orçamento" });
      await expect(orcamento).toHaveAttribute("data-aviso", "");
      await expect(page.locator("#orcamento form")).toHaveCount(1);
    });
  }
});
```

Em `tests/e2e/secoes.spec.ts`, no teste "O que a gente faz: quatro cartões que levam às páginas de serviço", troque:

```ts
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Energia solar para casa");
```

por:

```ts
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Energia solar para casa em Cuiabá");
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/servicos.spec.ts --project=desktop --project=mobile`
Esperado: FAIL nos 5 testes. As páginas ainda são "Em construção", sem a lista nem a trilha.

- [ ] **Passo 3: O cabeçalho das páginas internas e a lista de perguntas**

Crie `components/ui/CabecalhoPagina.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { Rotulo } from "./Rotulo";

export type ItemTrilha = { rotulo: string; href?: string };

type Props = { titulo: string; rotulo?: string; apoio?: string; trilha?: ItemTrilha[]; children?: ReactNode };

/** Abertura das páginas internas: trilha, rótulo, H1, texto de apoio e o que vier junto (botão, ilustração). */
export function CabecalhoPagina({ titulo, rotulo, apoio, trilha, children }: Props) {
  return (
    <div className="cabecalho">
      <div className="cabecalho__miolo">
        {trilha && (
          <nav className="trilha" aria-label="Trilha">
            <ol>
              {trilha.map((item) => (
                <li key={item.rotulo}>
                  {item.href ? (
                    <Link href={item.href}>{item.rotulo}</Link>
                  ) : (
                    <span aria-current="page">{item.rotulo}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {rotulo && <Rotulo>{rotulo}</Rotulo>}
        <h1 className="cabecalho__titulo">{titulo}</h1>
        {apoio && <p className="cabecalho__apoio">{apoio}</p>}
        {children}
      </div>
    </div>
  );
}
```

Crie `components/ui/cabecalho.css`:

```css
/* Abertura das páginas internas: faixa azul-céu clara com a trilha, o H1 e o texto de apoio. */
@layer components {
  .cabecalho {
    padding: 136px 16px 56px;
    background: var(--color-ceu-claro);
    border-bottom: 2.5px solid var(--color-profundo);
  }
  .cabecalho__miolo {
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .cabecalho__titulo {
    max-width: 20ch;
    font-weight: 800;
    font-size: clamp(2.3rem, 5.4vw, 4.2rem);
    line-height: 1;
  }
  .cabecalho__apoio {
    max-width: 60ch;
    margin-top: 18px;
    font-size: 1.15rem;
    color: var(--color-tinta-suave);
  }
  .trilha ol {
    display: flex;
    flex-wrap: wrap;
    gap: 0 8px;
    margin: 0 0 12px;
    padding: 0;
    list-style: none;
    font-size: 0.92rem;
  }
  .trilha li {
    display: inline-flex;
    align-items: center;
  }
  .trilha li + li::before {
    content: "›";
    margin-right: 8px;
    color: var(--color-tinta-suave);
  }
  .trilha a,
  .trilha [aria-current] {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
  .trilha a {
    text-underline-offset: 4px;
  }
  .trilha [aria-current] {
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .cabecalho {
      padding-top: 104px;
    }
  }
}
```

Crie `components/ui/ListaPerguntas.tsx`:

```tsx
import type { Pergunta } from "@/content/tipos";

/** Perguntas em details/summary: funcionam sem JavaScript e pelo teclado (estilo em perguntas.css). */
export function ListaPerguntas({ perguntas }: { perguntas: Pergunta[] }) {
  return (
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
  );
}
```

Troque `components/inicio/Perguntas.tsx` por:

```tsx
import { ListaPerguntas } from "@/components/ui/ListaPerguntas";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";

/** As oito perguntas frequentes da Início. */
export function Perguntas() {
  return (
    <Secao id="perguntas" titulo={inicio.perguntas.titulo} className="perguntas">
      <ListaPerguntas perguntas={perguntas} />
    </Secao>
  );
}
```

- [ ] **Passo 4: O cartão de serviço, a lista e a página de cada serviço**

Crie `components/servicos/CartaoServico.tsx`:

```tsx
import Link from "next/link";
import { IconeServico } from "@/components/inicio/IconeServico";
import type { Servico } from "@/content/tipos";

type Props = { servico: Servico; nivel: "h2" | "h3" };

/** Cartão de um serviço (estilo em fazemos.css). O nível do título depende de onde o cartão está. */
export function CartaoServico({ servico, nivel: Titulo }: Props) {
  return (
    <li className="fazemos__cartao">
      <IconeServico nome={servico.icone} className="fazemos__icone" />
      <Titulo className="fazemos__titulo">{servico.cartao.titulo}</Titulo>
      <p className="fazemos__texto">{servico.cartao.texto}</p>
      <Link className="fazemos__link" href={`/servicos/${servico.slug}`}>
        {servico.nome} <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}
```

Troque `components/inicio/OQueFazemos.tsx` por:

```tsx
import { CartaoServico } from "@/components/servicos/CartaoServico";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { servicos } from "@/content/servicos";

/** Os quatro serviços em cartões, cada um levando à sua página. */
export function OQueFazemos() {
  return (
    <Secao id="o-que-fazemos" rotulo={inicio.oQueFazemos.rotulo} titulo={inicio.oQueFazemos.titulo}>
      <ul className="fazemos__lista">
        {servicos.map((s) => (
          <CartaoServico key={s.slug} servico={s} nivel="h3" />
        ))}
      </ul>
    </Secao>
  );
}
```

Crie `components/servicos/PaginaServico.tsx`:

```tsx
import { IconeServico } from "@/components/inicio/IconeServico";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { ListaPerguntas } from "@/components/ui/ListaPerguntas";
import { Secao } from "@/components/ui/Secao";
import { paginas } from "@/content/paginas";
import type { Servico } from "@/content/tipos";
import { preencher } from "@/lib/texto";

const t = paginas.servico;

function Marca() {
  return (
    <svg className="servico__marca" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" fill="#F5B800" stroke="#0E3557" strokeWidth="2.5" />
      <path
        d="M9 16.5 L14 21 L23 11"
        fill="none"
        stroke="#0E3557"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Página de um serviço: abertura com o orçamento, o que está incluído, o bloco próprio do serviço, perguntas e formulário. */
export function PaginaServico({ servico }: { servico: Servico }) {
  return (
    <>
      <CabecalhoPagina
        titulo={servico.h1}
        apoio={servico.abertura}
        trilha={[
          { rotulo: t.trilhaInicio, href: "/" },
          { rotulo: t.trilhaServicos, href: "/servicos" },
          { rotulo: servico.nome },
        ]}
      >
        <div className="servico__acoes">
          <LinkWhatsapp
            className="botao botao--ipe"
            mensagem={preencher(t.mensagem, { servico: servico.nome.toLowerCase() })}
          >
            {t.botao}
          </LinkWhatsapp>
        </div>
        <IconeServico nome={servico.icone} className="servico__icone" />
      </CabecalhoPagina>
      <Secao id="incluido" titulo={servico.incluido.titulo}>
        <ul className="servico__lista">
          {servico.incluido.itens.map((item) => (
            <li key={item}>
              <Marca />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Secao>
      <Secao id="extra" titulo={servico.extra.titulo} className="servico__extra">
        <ul className="servico__chips">
          {servico.extra.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Secao>
      <Secao id="perguntas" titulo={t.perguntas} className="perguntas">
        <ListaPerguntas perguntas={servico.perguntas} />
      </Secao>
      <ChamadaFinal />
    </>
  );
}
```

Crie `components/servicos/servico.css`:

```css
@layer components {
  .servico__acoes {
    margin-top: 28px;
  }
  /* a ilustração do serviço fica à direita do cabeçalho no computador */
  .cabecalho__miolo:has(.servico__icone) {
    position: relative;
    padding-right: 260px;
  }
  .servico__icone {
    position: absolute;
    right: 0;
    bottom: -8px;
    width: 230px;
    height: auto;
  }
  .servico__lista {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 32px;
    margin-top: 36px;
    padding: 0;
    list-style: none;
  }
  .servico__lista li {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 12px;
    align-items: start;
    font-size: 1.08rem;
  }
  .servico__marca {
    width: 32px;
    height: 32px;
  }
  .servico__extra {
    background: var(--color-ceu-claro);
    border-block: 2.5px solid var(--color-profundo);
  }
  .servico__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
    padding: 0;
    list-style: none;
  }
  .servico__chips li {
    padding: 10px 18px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 18px;
    background: var(--color-papel);
    font-weight: 600;
  }
  @media (max-width: 860px) {
    .cabecalho__miolo:has(.servico__icone) {
      padding-right: 0;
    }
    .servico__icone {
      position: static;
      display: block;
      width: 160px;
      margin-top: 28px;
    }
    .servico__lista {
      grid-template-columns: 1fr;
    }
  }
}
```

Troque `app/servicos/page.tsx` por:

```tsx
import { CartaoServico } from "@/components/servicos/CartaoServico";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import { metadados } from "@/lib/seo";

const t = paginas.servicos;

export const metadata = metadados(t.seo);

export default function Servicos() {
  return (
    <>
      <CabecalhoPagina rotulo={t.rotulo} titulo={t.titulo} apoio={t.apoio} />
      <section className="secao" aria-label={t.rotulo}>
        <div className="secao__miolo">
          <ul className="fazemos__lista">
            {servicos.map((s) => (
              <CartaoServico key={s.slug} servico={s} nivel="h2" />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
```

Troque `app/servicos/[slug]/page.tsx` por:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaServico } from "@/components/servicos/PaginaServico";
import { servicos } from "@/content/servicos";
import { metadados } from "@/lib/seo";

// Com cacheComponents, o Next 16 não aceita dynamicParams: endereço fora da lista cai no notFound().
export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  return servico ? metadados(servico.seo) : {};
}

export default async function Pagina({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  return <PaginaServico servico={servico} />;
}
```

Em `app/globals.css`:
- acrescente depois do `@import "../components/ui/revelar.css";`:

  ```css
  @import "../components/ui/cabecalho.css";
  ```

- acrescente depois do `@import "../components/contato/pedido.css";`:

  ```css
  @import "../components/servicos/servico.css";
  ```

- [ ] **Passo 5: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/servicos.spec.ts tests/e2e/secoes.spec.ts tests/e2e/base.spec.ts --project=desktop --project=mobile`
Esperado: PASS nos dois projetos.

- [ ] **Passo 6: Commit**

```bash
git add components app/servicos app/globals.css tests/e2e
git commit -m "feat: lista de serviços e página de cada serviço

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Tarefa 3: Sobre, com a equipe ilustrada e o mapa desenhado

**Arquivos:**
- Criar:
  - `components/sobre/Retrato.tsx`, `components/sobre/Equipe.tsx` e `components/sobre/sobre.css`;
  - `components/contato/MapaDesenhado.tsx`.
- Modificar: `app/sobre/page.tsx`, `app/globals.css`
- Teste: `tests/e2e/sobre.spec.ts`

**Interfaces:**
- Consome:
  - `equipe`, `paginas.sobre` e `metadados` (Tarefa 1);
  - `empresa` (`numeros` e `cidades`);
  - `CabecalhoPagina` (Tarefa 2);
  - `Secao` e `ChamadaFinal`.
- Produz:
  - `Retrato({ retrato, id, className? })`, com `id` único para o recorte do SVG;
  - `Equipe()`;
  - `MapaDesenhado({ className? })`, o SVG decorativo do mapa, que a Tarefa 4 reusa na Contato.

- [ ] **Passo 1: Escrever o teste que falha**

Crie `tests/e2e/sobre.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("Sobre", () => {
  test("história, números, equipe com retratos e cidades atendidas", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page).toHaveTitle("Sobre a Ipê Solar | Energia solar em Cuiabá");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gente de Cuiabá cuidando do seu telhado.");
    await expect(page.locator(".cabecalho")).toContainText("numa garagem no Coxipó");
    await expect(page.locator("#numeros li")).toHaveCount(3);
    await expect(page.locator("#numeros")).toContainText("1.200");
    const equipe = page.locator("#equipe");
    await expect(equipe.getByRole("heading", { level: 3 })).toHaveText([
      "Marina Duarte",
      "Paulo Arruda",
      "Luana Campos",
      "Tião Moraes",
    ]);
    await expect(equipe.locator("svg.membro__retrato")).toHaveCount(4);
    for (const svg of await equipe.locator("svg.membro__retrato").all()) {
      await expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.locator("#onde-atendemos li")).toHaveCount(9);
    await expect(page.locator("#orcamento form")).toHaveCount(1);
  });
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/sobre.spec.ts --project=desktop --project=mobile`
Esperado: FAIL, porque a página ainda é "Em construção" e o título é "Sobre | Ipê Solar".

- [ ] **Passo 3: Os retratos e a equipe**

Crie `components/sobre/Retrato.tsx`:

```tsx
import type { RetratoMembro } from "@/content/tipos";

const CONTORNO = { stroke: "#0E3557", strokeWidth: 4, strokeLinejoin: "round" as const };

/** Franja de cada tipo de cabelo, por cima da cabeça. */
const FRANJA: Record<RetratoMembro["cabelo"], string> = {
  curto: "M50 64 C50 44 64 36 80 36 C98 36 110 46 110 64 C104 54 92 50 80 50 C68 50 56 54 50 64 Z",
  longo: "M50 66 C52 44 66 36 80 36 C96 36 110 44 110 66 C100 56 88 50 80 50 C70 50 58 56 50 66 Z",
  coque: "M50 62 C50 44 64 38 80 38 C96 38 110 44 110 62 C102 52 90 48 80 48 C70 48 58 52 50 62 Z",
};

type Props = { retrato: RetratoMembro; id: string; className?: string };

/** Retrato ilustrado no traço do hero (sem fotos de pessoas reais). Decorativo: o nome vem em texto ao lado. */
export function Retrato({ retrato, id, className }: Props) {
  const { pele, cabelo, corCabelo, roupa, acessorio } = retrato;
  const coberto = acessorio === "capacete" || acessorio === "bone";
  return (
    <svg className={className} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <circle cx="80" cy="80" r="74" />
        </clipPath>
      </defs>
      <circle cx="80" cy="80" r="76" fill="#D6EEFB" {...CONTORNO} />
      <g clipPath={`url(#${id})`}>
        {cabelo === "longo" && <ellipse cx="80" cy="84" rx="38" ry="44" fill={corCabelo} {...CONTORNO} />}
        {cabelo === "coque" && !coberto && <circle cx="80" cy="30" r="13" fill={corCabelo} {...CONTORNO} />}
        <path d="M22 164 C24 126 50 110 80 110 C110 110 136 126 138 164 Z" fill={roupa} {...CONTORNO} />
        <path d="M70 92 H90 V114 C84 120 76 120 70 114 Z" fill={pele} {...CONTORNO} />
        <ellipse cx="80" cy="70" rx="30" ry="34" fill={pele} {...CONTORNO} />
        {!coberto && <path d={FRANJA[cabelo]} fill={corCabelo} {...CONTORNO} />}
        <circle cx="69" cy="74" r="3.5" fill="#0E3557" />
        <circle cx="91" cy="74" r="3.5" fill="#0E3557" />
        <circle cx="62" cy="85" r="5" fill="#F08C7A" opacity="0.45" />
        <circle cx="98" cy="85" r="5" fill="#F08C7A" opacity="0.45" />
        <path d="M71 88 Q80 95 89 88" fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinecap="round" />
        {acessorio === "oculos" && (
          <g fill="none" stroke="#0E3557" strokeWidth="3">
            <circle cx="69" cy="74" r="9" />
            <circle cx="91" cy="74" r="9" />
            <path d="M78 74 H82" />
          </g>
        )}
        {acessorio === "capacete" && (
          <g fill="#F5B800" {...CONTORNO}>
            <path d="M48 62 C48 36 62 28 80 28 C98 28 112 36 112 62 Z" />
            <rect x="42" y="58" width="76" height="9" rx="4" />
          </g>
        )}
        {acessorio === "bone" && (
          <g fill="#E2683C" {...CONTORNO}>
            <path d="M50 58 C50 38 64 32 80 32 C96 32 110 38 110 58 Z" />
            <path d="M104 56 C116 55 126 58 129 63 L104 63 Z" />
          </g>
        )}
      </g>
    </svg>
  );
}
```

Crie `components/sobre/Equipe.tsx`:

```tsx
import { equipe } from "@/content/equipe";
import { Retrato } from "./Retrato";

/** A equipe em quatro cartões, cada um com o retrato ilustrado. */
export function Equipe() {
  return (
    <ul className="equipe">
      {equipe.map((m, i) => (
        <li key={m.nome} className="membro">
          <Retrato retrato={m.retrato} id={`retrato-${i}`} className="membro__retrato" />
          <h3 className="membro__nome">{m.nome}</h3>
          <p className="membro__cargo">{m.cargo}</p>
          <p className="membro__texto">{m.texto}</p>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Passo 4: O mapa desenhado**

Crie `components/contato/MapaDesenhado.tsx`:

```tsx
/** Mapa ilustrado de Cuiabá: ruas, o rio Cuiabá e um pino. Decorativo (a legenda vem em texto). */
export function MapaDesenhado({ className }: { className?: string }) {
  const RIO = "M-20 260 C80 230 140 300 240 270 C340 240 380 330 470 300 C540 280 580 320 620 300";
  return (
    <svg className={className} viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect width="600" height="400" fill="#E6F2DF" />
      <g fill="#CFE6C4">
        <circle cx="90" cy="70" r="60" />
        <circle cx="520" cy="330" r="80" />
        <circle cx="470" cy="60" r="40" />
      </g>
      <g fill="none" stroke="#FAFAF5" strokeWidth="14" strokeLinecap="round">
        <path d="M0 150 C120 140 220 170 320 160 C420 150 500 120 600 130" />
        <path d="M180 0 C190 120 170 260 200 400" />
        <path d="M380 0 C370 140 400 260 390 400" />
        <path d="M0 340 C150 330 300 360 600 330" />
      </g>
      <path d={RIO} fill="none" stroke="#0E3557" strokeWidth="26" strokeLinecap="round" />
      <path d={RIO} fill="none" stroke="#3FA2DB" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="300" cy="182" rx="16" ry="5" fill="#0E3557" opacity="0.2" />
      <g transform="translate(300 178)">
        <path
          d="M0 0 C-14 -18 -24 -30 -24 -44 A24 24 0 0 1 24 -44 C24 -30 14 -18 0 0 Z"
          fill="#F5B800"
          stroke="#0E3557"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cy="-44" r="9" fill="#0E3557" />
      </g>
    </svg>
  );
}
```

- [ ] **Passo 5: A página e o CSS**

Troque `app/sobre/page.tsx` por:

```tsx
import { MapaDesenhado } from "@/components/contato/MapaDesenhado";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { Equipe } from "@/components/sobre/Equipe";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { Secao } from "@/components/ui/Secao";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";
import { metadados } from "@/lib/seo";

const t = paginas.sobre;

export const metadata = metadados(t.seo);

export default function Sobre() {
  return (
    <>
      <CabecalhoPagina rotulo={t.rotulo} titulo={t.titulo} apoio={t.historia} />
      <Secao id="numeros" titulo={t.numerosTitulo}>
        <ul className="numeros__lista">
          {empresa.numeros.map((n) => (
            <li key={n.rotulo}>
              <strong>{n.valor}</strong>
              <span>{n.rotulo}</span>
            </li>
          ))}
        </ul>
      </Secao>
      <Secao id="equipe" titulo={t.equipeTitulo}>
        <Equipe />
      </Secao>
      <Secao id="onde-atendemos" titulo={t.ondeTitulo} className="onde">
        <div className="onde__grade">
          <div>
            <p className="onde__apoio">{t.ondeApoio}</p>
            <ul className="onde__cidades">
              {empresa.cidades.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <MapaDesenhado className="onde__mapa" />
        </div>
      </Secao>
      <ChamadaFinal />
    </>
  );
}
```

Crie `components/sobre/sobre.css`:

```css
@layer components {
  .numeros__lista {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
    padding: 0;
    list-style: none;
  }
  .numeros__lista li {
    display: grid;
    gap: 6px;
    padding: 26px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 20px;
    background: var(--color-ipe);
    box-shadow: var(--shadow-dura);
    font-weight: 600;
  }
  .numeros__lista strong {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    line-height: 1;
  }
  .equipe {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
    margin-top: 44px;
    padding: 0;
    list-style: none;
  }
  .membro__retrato {
    width: 160px;
    height: 160px;
  }
  .membro__nome {
    margin-top: 16px;
    font-weight: 800;
    font-size: 1.3rem;
  }
  .membro__cargo {
    margin-top: 6px;
    font: 500 0.78rem/1.3 var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-rotulo);
  }
  .membro__texto {
    margin-top: 10px;
    color: var(--color-tinta-suave);
  }
  .onde {
    background: var(--color-ceu-claro);
    border-block: 2.5px solid var(--color-profundo);
  }
  .onde__grade {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 40px;
    align-items: center;
    margin-top: 36px;
  }
  .onde__apoio {
    max-width: 44ch;
    color: var(--color-tinta-suave);
  }
  .onde__cidades {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    padding: 0;
    list-style: none;
  }
  .onde__cidades li {
    padding: 8px 14px;
    border: 2px solid var(--color-profundo);
    border-radius: 999px;
    background: var(--color-papel);
    font-weight: 600;
  }
  .onde__mapa {
    width: 100%;
    height: auto;
    border: 2.5px solid var(--color-profundo);
    border-radius: 22px;
    box-shadow: var(--shadow-dura);
  }
  @media (max-width: 1000px) {
    .equipe {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 860px) {
    .numeros__lista,
    .onde__grade {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 520px) {
    .equipe {
      grid-template-columns: 1fr;
    }
  }
}
```

Em `app/globals.css`, acrescente depois do `@import "../components/servicos/servico.css";`:

```css
@import "../components/sobre/sobre.css";
```

- [ ] **Passo 6: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/sobre.spec.ts tests/e2e/whatsapp.spec.ts tests/e2e/geometria.spec.ts tests/e2e/barra.spec.ts --project=desktop --project=mobile`
Esperado: PASS. Os testes do Plano 1 que usam a Sobre (botão flutuante, rodapé e barra) continuam verdes com a página nova.

- [ ] **Passo 7: Conferir os retratos com os próprios olhos**

Com o `npm run dev` rodando, abra http://localhost:3000/sobre e confira os quatro retratos:
- os quatro dentro do círculo;
- o capacete do Paulo, os óculos da Luana e o boné do Tião;
- nenhum traço saindo do desenho.

- [ ] **Passo 8: Commit**

```bash
git add components/sobre components/contato/MapaDesenhado.tsx app/sobre app/globals.css tests/e2e/sobre.spec.ts
git commit -m "feat: página Sobre com a equipe em retratos ilustrados

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 4: Contato, com o mapa preguiçoso e o formulário

**Arquivos:**
- Criar:
  - `components/contato/Mapa.tsx` e `components/contato/mapa.css`;
  - `components/contato/BlocosContato.tsx` e `components/contato/contato.css`.
- Modificar: `app/contato/page.tsx`, `app/globals.css`, `tests/unit/modo-desligado.test.tsx`
- Teste: `tests/e2e/contato.spec.ts`

**Interfaces:**
- Consome:
  - `MapaDesenhado` (Tarefa 3);
  - `paginas.contato` e `metadados` (Tarefa 1);
  - `empresa` (`telefone`, `horario` e `mapa`);
  - `CabecalhoPagina`, `ChamadaFinal` e `LinkWhatsapp`.
- Produz:
  - `Mapa()` (cliente): `figure.mapa`, com `div.mapa__quadro` e o iframe só depois de chegar perto;
  - `BlocosContato()`.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/contato.spec.ts`:

```ts
import { expect, test, type Page } from "@playwright/test";

/** Nunca carrega o Google de verdade: o iframe recebe uma página vazia. */
async function semGoogle(page: Page) {
  await page.route("https://www.google.com/**", (rota) =>
    rota.fulfill({ contentType: "text/html", body: "<!doctype html><title>mapa</title>" }),
  );
}

test.describe("Contato", () => {
  test("WhatsApp, horário, local e formulário; sem telefone no modo conceito", async ({ page }) => {
    await semGoogle(page);
    await page.goto("/contato");
    await expect(page).toHaveTitle("Contato | Ipê Solar Cuiabá");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fale com a gente.");
    const blocos = page.locator(".contato__blocos");
    await expect(blocos.getByRole("link", { name: "Chamar no WhatsApp" })).toHaveAttribute("data-aviso", "");
    await expect(blocos).toContainText("Segunda a sexta, das 7h às 17h");
    await expect(blocos).toContainText("Cuiabá-MT · atendimento no local com hora marcada");
    await expect(blocos).not.toContainText("Telefone");
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(page.locator("#orcamento form")).toHaveCount(1);
  });

  test("o mapa só carrega o iframe perto da tela, sem mudar de altura", async ({ page }) => {
    await semGoogle(page);
    await page.setViewportSize({ width: 375, height: 400 });
    await page.goto("/contato");
    const quadro = page.locator(".mapa__quadro");
    await expect(quadro.locator("iframe")).toHaveCount(0);
    const antes = (await quadro.boundingBox())!.height;
    await quadro.scrollIntoViewIfNeeded();
    const iframe = quadro.locator("iframe");
    await expect(iframe).toHaveAttribute("title", "Mapa de Cuiabá, MT");
    await expect(iframe).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?q=Cuiab%C3%A1%2C%20MT&z=12&output=embed$/);
    expect((await quadro.boundingBox())!.height).toBeCloseTo(antes, 0);
    await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toBeVisible();
  });
});

test.describe("Contato sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mapa desenhado com o link alternativo, sem iframe, e o formulário envia", async ({ page }) => {
    await semGoogle(page);
    await page.goto("/contato");
    await expect(page.locator(".mapa__quadro iframe")).toHaveCount(0);
    await expect(page.locator(".mapa__desenho")).toBeVisible();
    await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=Cuiab%C3%A1%2C%20MT",
    );
    const form = page.locator("#orcamento form");
    await form.getByLabel("Nome").fill("Ana");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
    await form.getByRole("radio", { name: "Casa" }).check();
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento")).toContainText("Mensagem recebida, Ana!");
  });
});
```

No fim de `tests/unit/modo-desligado.test.tsx`, dentro do `describe("modo conceito desligado", …)`, acrescente (o mock da empresa no topo do arquivo ganha o telefone, veja abaixo):

```tsx
  it("a Contato mostra o telefone da empresa com o link tel: certo", async () => {
    const { BlocosContato } = await import("@/components/contato/BlocosContato");
    const html = renderToStaticMarkup(<BlocosContato />);
    expect(html).toContain("Telefone");
    expect(html).toContain('href="tel:+556533221100"');
    expect(html).toContain("(65) 3322-1100");
  });
```

e, no `vi.mock("@/content/empresa", …)` do topo, troque:

```tsx
  return { empresa: { ...empresa, whatsapp: "55 65 99999-8888", emailPedidos: "pedidos@exemplo.com.br" } };
```

por:

```tsx
  return {
    empresa: {
      ...empresa,
      whatsapp: "55 65 99999-8888",
      emailPedidos: "pedidos@exemplo.com.br",
      telefone: "(65) 3322-1100",
    },
  };
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx vitest run tests/unit/modo-desligado.test.tsx`
Esperado: FAIL com "Cannot find package '@/components/contato/BlocosContato'".

O Playwright não roda nesta etapa. A checagem de tipos do build falharia pelo mesmo import, como na Tarefa 4 do Plano 2.

- [ ] **Passo 3: Os blocos de contato e o mapa**

Crie `components/contato/BlocosContato.tsx`:

```tsx
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";

const t = paginas.contato;

/** Telefone para o link tel:, com o DDI 55. */
function linkTelefone(numero: string): string {
  const digitos = numero.replace(/\D/g, "");
  return `tel:+${digitos.startsWith("55") ? digitos : `55${digitos}`}`;
}

/** WhatsApp, telefone (só se a empresa tiver), horário e local. */
export function BlocosContato() {
  return (
    <div className="contato__blocos">
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.whatsappTitulo}</h2>
        <p>{t.whatsappTexto}</p>
        <LinkWhatsapp className="botao botao--ipe">{t.whatsappBotao}</LinkWhatsapp>
      </div>
      {empresa.telefone && (
        <div className="contato__bloco">
          <h2 className="contato__titulo">{t.telefone}</h2>
          <p>
            <a href={linkTelefone(empresa.telefone)}>{empresa.telefone}</a>
          </p>
        </div>
      )}
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.horario}</h2>
        <ul>
          {empresa.horario.map((h) => (
            <li key={h.dias}>
              {h.dias}, {h.horas}
            </li>
          ))}
        </ul>
      </div>
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.local}</h2>
        <p>{empresa.mapa.legenda}</p>
      </div>
    </div>
  );
}
```

Crie `components/contato/Mapa.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";
import { MapaDesenhado } from "./MapaDesenhado";

const consulta = encodeURIComponent(empresa.mapa.consulta);
const embutido = `https://www.google.com/maps?q=${consulta}&z=12&output=embed`;
const abrir = `https://www.google.com/maps?q=${consulta}`;

/**
 * Cartão do mapa: o desenho aparece na hora, e o iframe do Google só entra quando o cartão chega a 300 px da tela,
 * com um fade. O cartão tem a mesma altura antes e depois, e o link para o Google Maps fica sempre visível.
 */
export function Mapa() {
  const quadro = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setPerto(true);
        observador.disconnect();
      },
      { rootMargin: "300px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <figure className="mapa">
      <div ref={quadro} className="mapa__quadro">
        <MapaDesenhado className="mapa__desenho" />
        {perto && (
          <iframe
            className={pronto ? "mapa__iframe mapa__iframe--pronto" : "mapa__iframe"}
            src={embutido}
            title={paginas.contato.mapaTitulo}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setPronto(true)}
          />
        )}
      </div>
      <figcaption className="mapa__legenda">
        <span>{empresa.mapa.legenda}</span>
        <a href={abrir} target="_blank" rel="noopener">
          {paginas.contato.abrirMapa}
        </a>
      </figcaption>
    </figure>
  );
}
```

Crie `components/contato/mapa.css`:

```css
/* O desenho e o iframe ocupam a mesma caixa (proporção 3:2): quando o mapa real chega, nada pula. */
@layer components {
  .mapa {
    margin: 0;
  }
  .mapa__quadro {
    position: relative;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border: 2.5px solid var(--color-profundo);
    border-radius: 22px;
    background: #e6f2df;
    box-shadow: var(--shadow-dura);
  }
  .mapa__desenho,
  .mapa__iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .mapa__iframe {
    opacity: 0;
    transition: opacity 0.6s var(--ease-saida);
  }
  .mapa__iframe--pronto {
    opacity: 1;
  }
  .mapa__legenda {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 4px 16px;
    margin-top: 12px;
    font-size: 0.95rem;
  }
  .mapa__legenda a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-weight: 600;
    text-underline-offset: 4px;
  }
}
```

Crie `components/contato/contato.css`:

```css
@layer components {
  .contato {
    padding: clamp(56px, 8vw, 96px) 16px;
  }
  .contato__miolo {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
    align-items: start;
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .contato__blocos {
    display: grid;
    gap: 16px;
  }
  .contato__bloco {
    padding: 22px;
    border: 2.5px solid var(--color-profundo);
    border-radius: 20px;
    background: var(--color-papel);
  }
  .contato__titulo {
    margin-bottom: 8px;
    font-weight: 800;
    font-size: 1.3rem;
  }
  .contato__bloco p,
  .contato__bloco ul {
    color: var(--color-tinta-suave);
  }
  .contato__bloco ul {
    padding: 0;
    list-style: none;
  }
  .contato__bloco .botao {
    margin-top: 14px;
  }
  .contato__bloco a[href^="tel:"] {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-weight: 600;
    color: var(--color-profundo);
  }
  @media (max-width: 860px) {
    .contato__miolo {
      grid-template-columns: 1fr;
    }
  }
}
```

- [ ] **Passo 4: A página**

Troque `app/contato/page.tsx` por:

```tsx
import { BlocosContato } from "@/components/contato/BlocosContato";
import { Mapa } from "@/components/contato/Mapa";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { metadados } from "@/lib/seo";

const t = paginas.contato;

export const metadata = metadados(t.seo);

export default function Contato() {
  return (
    <>
      <CabecalhoPagina titulo={t.titulo} apoio={t.apoio} />
      <section className="contato" aria-label={t.blocosRotulo}>
        <div className="contato__miolo">
          <BlocosContato />
          <Mapa />
        </div>
      </section>
      <ChamadaFinal />
    </>
  );
}
```

Em `app/globals.css`, acrescente depois do `@import "../components/sobre/sobre.css";`:

```css
@import "../components/contato/contato.css";
@import "../components/contato/mapa.css";
```

- [ ] **Passo 5: Rodar e ver passar**

Rode: `npm test && npm run lint && npm run typecheck && npx playwright test tests/e2e/contato.spec.ts --project=desktop --project=mobile`
Esperado: PASS no Vitest (com o teste do telefone) e nos 3 testes de ponta a ponta, nos dois projetos.

Se o teste do mapa achar o iframe já no início: o cartão está a menos de 700 px do topo nos 375 × 400. Confira a altura dos blocos antes de mexer no teste. A spec pede o iframe só perto da tela.

- [ ] **Passo 6: Commit**

```bash
git add components/contato app/contato app/globals.css tests/e2e/contato.spec.ts tests/unit/modo-desligado.test.tsx
git commit -m "feat: página Contato com o mapa preguiçoso e o formulário

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 5: A 404 e o piso de qualidade de todas as páginas

**Arquivos:**
- Criar: `app/not-found.tsx`, `components/erro/IlustracaoSombra.tsx`, `components/erro/nao-encontrada.css`
- Modificar: `app/globals.css`
- Teste: `tests/e2e/rotas.spec.ts`

**Interfaces:**
- Consome:
  - `paginas.naoEncontrada` e `metadados` (Tarefa 1);
  - `RAIOS` de `components/hero/geometria.ts` (Plano 2), para o sol da ilustração ter os mesmos raios do hero.
- Produz: a página 404 do site inteiro.

- [ ] **Passo 1: Escrever os testes que falham**

Crie `tests/e2e/rotas.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const ROTAS = [
  "/",
  "/servicos",
  "/servicos/energia-solar-residencial",
  "/servicos/energia-solar-para-empresas",
  "/servicos/energia-solar-rural",
  "/servicos/limpeza-de-placas-solares",
  "/sobre",
  "/contato",
];

test.describe("todas as páginas", () => {
  for (const rota of ROTAS) {
    test(`${rota}: um H1, título e descrição no tamanho, sem erros e nada saindo pela direita`, async ({ page }) => {
      const erros: string[] = [];
      page.on("pageerror", (e) => erros.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") erros.push(m.text());
      });
      await page.route("https://www.google.com/**", (r) =>
        r.fulfill({ contentType: "text/html", body: "<!doctype html><title>mapa</title>" }),
      );
      await page.goto(rota);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const titulo = await page.title();
      expect(titulo).toContain("Ipê Solar");
      expect(titulo.length).toBeLessThanOrEqual(60);
      const descricao = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(descricao.length).toBeGreaterThanOrEqual(50);
      expect(descricao.length).toBeLessThanOrEqual(160);
      const vazados = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => !el.closest("#hero-palco"))
          .filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > window.innerWidth + 0.5)
          .map((el) => el.tagName),
      );
      expect(vazados).toEqual([]);
      expect(erros).toEqual([]);
    });
  }
});

test("endereço que não existe: 404 com a página que tomou sombra", async ({ page }) => {
  for (const rota of ["/nao-existe", "/servicos/nao-existe"]) {
    const resposta = await page.goto(rota);
    expect(resposta!.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Essa página tomou sombra.");
    await expect(page.getByRole("main").getByRole("link", { name: "Voltar para a Início" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page).toHaveTitle("Página não encontrada | Ipê Solar");
  }
});
```

- [ ] **Passo 2: Rodar e ver falhar**

Rode: `npx playwright test tests/e2e/rotas.spec.ts --project=desktop --project=mobile`
Esperado:
- FAIL no teste da 404, porque a página padrão do Next mostra "This page could not be found." e não tem o H1 esperado;
- os testes das rotas devem passar. Se algum falhar, é um defeito das Tarefas 2 a 4: corrija antes de seguir e registre no ledger.

- [ ] **Passo 3: A ilustração e a página**

Antes de escrever, leia `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`.

Crie `components/erro/IlustracaoSombra.tsx`:

```tsx
import { RAIOS } from "@/components/hero/geometria";

const NUVEM =
  "M26 82 C8 82 2 64 14 56 C10 40 28 30 42 38 C46 18 70 10 86 22 C98 6 128 6 138 24 C156 16 178 28 174 46 C192 48 198 68 186 78 C182 82 178 82 172 82 Z";

/** O sol do hero escondido atrás de uma nuvem: a página "tomou sombra". Decorativa. */
export function IlustracaoSombra({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <g transform="translate(200 92) scale(0.42)">
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
        <circle r="80" fill="#FFD23F" stroke="#E08A00" strokeWidth="6" />
        <circle r="60" fill="#FFE27A" />
      </g>
      <g transform="translate(36 96) scale(1.25)">
        <path d={NUVEM} fill="#FAFAF5" />
        <path
          d="M12 64 C40 76 90 70 120 76 C150 82 172 72 192 64 C194 76 186 82 172 82 L26 82 C14 82 8 74 12 64 Z"
          fill="#D7ECFA"
        />
        <path d={NUVEM} fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <ellipse cx="160" cy="226" rx="110" ry="9" fill="#0E3557" opacity="0.15" />
    </svg>
  );
}
```

Crie `app/not-found.tsx`:

```tsx
import Link from "next/link";
import { IlustracaoSombra } from "@/components/erro/IlustracaoSombra";
import { paginas } from "@/content/paginas";
import { metadados } from "@/lib/seo";

const t = paginas.naoEncontrada;

export const metadata = metadados(t.seo);

/** A 404 do site: "Essa página tomou sombra", com a ilustração e o caminho de volta. */
export default function NaoEncontrada() {
  return (
    <section className="nao-encontrada">
      <div className="nao-encontrada__miolo">
        <IlustracaoSombra className="nao-encontrada__desenho" />
        <div>
          <p className="rotulo">404</p>
          <h1 className="nao-encontrada__titulo">{t.titulo}</h1>
          <p className="nao-encontrada__texto">{t.texto}</p>
          <Link className="botao botao--ipe" href="/">
            {t.botao}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

Crie `components/erro/nao-encontrada.css`:

```css
@layer components {
  .nao-encontrada {
    padding: 140px 16px 96px;
  }
  .nao-encontrada__miolo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .nao-encontrada__desenho {
    width: 100%;
    max-width: 420px;
    height: auto;
  }
  .nao-encontrada__titulo {
    max-width: 12ch;
    font-weight: 800;
    font-size: clamp(2.4rem, 5.6vw, 4.4rem);
    line-height: 1;
  }
  .nao-encontrada__texto {
    max-width: 40ch;
    margin: 18px 0 28px;
    font-size: 1.15rem;
    color: var(--color-tinta-suave);
  }
  @media (max-width: 860px) {
    .nao-encontrada {
      padding-top: 104px;
    }
    .nao-encontrada__miolo {
      grid-template-columns: 1fr;
    }
    .nao-encontrada__desenho {
      max-width: 280px;
    }
  }
}
```

Em `app/globals.css`, acrescente depois do `@import "../components/contato/mapa.css";`:

```css
@import "../components/erro/nao-encontrada.css";
```

- [ ] **Passo 4: Rodar e ver passar**

Rode: `npm run lint && npm run typecheck && npx playwright test tests/e2e/rotas.spec.ts --project=desktop --project=mobile`
Esperado: PASS nos 9 testes, nos dois projetos.

- [ ] **Passo 5: Commit**

```bash
git add app/not-found.tsx components/erro app/globals.css tests/e2e/rotas.spec.ts
git commit -m "feat: página 404 e piso de qualidade de todas as páginas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tarefa 6: Verificação final e entrega para revisão

**Arquivos:**
- Modificar: `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, no registro de progresso. É outro repositório, e fica sem commit.

**Interfaces:**
- Consome: tudo das Tarefas 1 a 5.
- Produz: a branch `feat/paginas` verde e enviada ao GitHub, pronta para a revisão final.

- [ ] **Passo 1: Lint, tipos e todos os testes**

Rode: `npm run lint && npm run typecheck && npm run test:all`
Esperado: nenhum erro, e todos os testes do Vitest e do Playwright passam, incluindo o projeto `desempenho`.

- [ ] **Passo 2: Build todo estático**

Rode: `npm run build`
Esperado:
- o build termina sem erro;
- a tabela de rotas mostra `/servicos`, as 4 páginas de serviço, `/sobre` e `/contato` como estáticas.

- [ ] **Passo 3: Conferir com os próprios olhos**

Com o `npm run dev` rodando (com `EMAIL_TRANSPORTE=teste`, para o formulário mostrar o sucesso), abra no computador e com a janela estreita (375 px):
- http://localhost:3000/servicos e uma página de serviço;
- http://localhost:3000/sobre;
- http://localhost:3000/contato, rolando até o mapa;
- http://localhost:3000/qualquer-coisa, para a 404.

Mande os links ao usuário no próprio chat, cada um numa linha, e faça a pergunta de aprovação no fim da mensagem, sem janela de pergunta.

- [ ] **Passo 4: Enviar a branch e registrar no portfólio**

Rode: `git push -u origin feat/paginas`

Em `/home/walien/portfolio-walien/docs/plano-de-projetos.md`, acrescente ao fim da tabela "Registro de progresso" uma linha com a data de hoje (DD/MM/AAAA):

```markdown
| DD/MM/AAAA | Site de negócio local | Plano 3 (Páginas) executado: lista e 4 páginas de serviço, Sobre com a equipe em retratos ilustrados, Contato com mapa preguiçoso e formulário, e a 404 "Essa página tomou sombra". |
```

Não faça commit nesse arquivo sem pedido do usuário.
