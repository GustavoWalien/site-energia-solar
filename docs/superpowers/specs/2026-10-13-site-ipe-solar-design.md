# Site da Ipê Solar: Design

**Data:** 2026-10-13
**Status:** aprovado em conversa (partes 1 a 4, com páginas de demonstração), aguardando revisão desta spec escrita

## 1. Objetivo e público

- **Objetivo duplo.** O site entra no portfólio como prova do serviço "sites e landing pages", conforme a seção 2 do plano de projetos. Também vira um **modelo reaproveitável**, para vender a empresas de energia solar de verdade trocando conteúdo, cores e contatos.
- **Para quem o site fala:**
  - famílias de Cuiabá e Várzea Grande com conta de luz alta;
  - donos de pequenos negócios;
  - produtores rurais da Baixada Cuiabana.
- **Sucesso:**
  - parece o site de um negócio de verdade;
  - nota 95+ nas quatro categorias do Lighthouse, no celular e no computador, com print guardado;
  - o link compartilhado no WhatsApp mostra imagem e título;
  - trocar a marca para outro cliente leva poucas horas, mexendo só em conteúdo e cores;
  - cada página afunila para uma ação: **Peça seu orçamento**, pelo WhatsApp ou pelo formulário.
- **Fontes deste design:**
  - textos em [docs/textos.md](../../textos.md), que é a fonte de todo texto do site;
  - protótipos em `prototipos/hero/`. A **v4 (`v4-barra-placa.html`) é a referência visual e de comportamento do hero**;
  - acabamento inspirado na skill "Site de 10K" (`site-de-10k/`);
  - páginas de demonstração aprovadas em `.superpowers/brainstorm/` (parte 2: interações; parte 3: blog e SEO; parte 4: testes e publicação).

## 2. Decisões tomadas

| Tema | Decisão |
|---|---|
| Idioma | Só português do Brasil |
| Endereço | `ipe-solar.vercel.app`, se estiver livre. Sem domínio próprio por enquanto |
| Abordagem | Site estático com conteúdo em arquivos tipados. Blog em MDX. Sem painel de edição (CMS) |
| Modelo reaproveitável | Sim: dados da empresa, cores e textos em `content/`, e a chave `modoConceito` em `content/config.ts` |
| Visual | Cartoon: contorno grosso azul-profundo, cores chapadas, sombra dura. Sol sem rosto |
| Paleta | Amarelo ipê `#F5B800`, azul-céu claro `#D6EEFB`, azul-céu `#3FA2DB`, azul-profundo `#0E3557` (textos), verde-mata `#1E4D3A`, off-white `#FAFAF5` (fundo) |
| Barra do topo | "Placa de loja": logo numa placa amarela pendurada numa faixa azul fina. Rejeitada a pílula flutuante |
| Hero | Animação em SVG guiada pelo scroll, portada do protótipo v4. Sem vídeo de IA |
| WhatsApp | No modo conceito, todo botão abre o aviso "Este é um projeto conceito", com o botão "Falar com quem fez este site" para `wa.me/5565981222210` |
| Formulário | Ação do servidor com Resend, pela integração `resend/resend-email` do Marketplace da Vercel. No modo conceito, chega para o autor |
| Equipe | Retratos ilustrados no estilo do hero. Sem fotos de pessoas reais |
| Blog | 3 artigos completos em MDX, escritos a partir dos roteiros de `docs/textos.md` |
| Google | Site indexável, para o SEO contar no Lighthouse. No modo conceito, nada de telefone nem endereço de rua inventados |
| Stack | Next.js 16.4 (App Router, `cacheComponents` e `partialPrefetching` já ligados), React 19.3, TypeScript, Tailwind CSS 4, `@next/mdx`. A animação usa motor próprio, sem biblioteca |
| Testes | Vitest e Playwright, no mesmo esquema do portfólio |

## 3. Mapa do site e partes comuns

### Rotas

| Rota | Página | Conteúdo de |
|---|---|---|
| `/` | Início | `content/inicio.ts`, `servicos.ts`, `perguntas.ts`, `depoimentos.ts` |
| `/servicos` | Lista dos serviços | `content/servicos.ts` |
| `/servicos/[slug]` | 4 páginas: `energia-solar-residencial`, `energia-solar-para-empresas`, `energia-solar-rural` e `limpeza-de-placas-solares` | `content/servicos.ts` |
| `/sobre` | História, números, equipe e cidades atendidas | `content/empresa.ts`, `equipe.ts` |
| `/contato` | WhatsApp, horário, mapa e formulário | `content/empresa.ts` |
| `/blog` | Lista de artigos | metadados dos MDX |
| `/blog/[slug]` | 3 artigos: `energia-solar-vale-a-pena-2026-fio-b`, `placas-solares-geram-menos-na-seca` e `creditos-de-energia-energisa` | `content/blog/*.mdx` |
| 404 | "Essa página tomou sombra", com ilustração e link para a Início | código |

Os serviços saíram da raiz (como estava em `docs/textos.md`) e foram para `/servicos/`, para outro cliente poder acrescentar ou tirar serviços só no conteúdo. As rotas dinâmicas usam `generateStaticParams`. O Next 16 não aceita `dynamicParams` junto com `cacheComponents` (o build recusa), então o endereço fora da lista cai no `notFound()` da própria página e responde 404 (decidido no Plano 2).

### Barra do topo (placa de loja)

- **Estrutura:**
  - faixa azul-profundo de 6 px colada no topo;
  - a placa amarela pendurada, com contorno de 2,5 px, cantos de baixo arredondados e sombra dura, contendo a flor e o texto "Ipê Solar";
  - à direita, os links (Serviços, Sobre, Blog, Contato) e o botão "Peça seu orçamento".
- **Celular:** a placa, o ícone de WhatsApp e o botão de menu. O menu abre um painel com contorno e fecha com Esc, no link ou no botão. Usa `aria-expanded`.
- **Estados na Início:**
  - transparente com links brancos enquanto o céu está escuro (progresso do hero até 0,3);
  - transparente com links azuis depois disso;
  - faixa sólida off-white com linha azul de 2,5 px embaixo quando o hero começa a sair da tela.
- **Nas outras páginas:** sempre sólida.
- **Movimento:** a placa balança uma vez ao carregar e de novo no hover. Com movimento reduzido, fica parada.

### Rodapé

Fundo azul-profundo com:
- marca e frase curta;
- links das páginas;
- horário de atendimento;
- cidades atendidas;
- no modo conceito, a linha "Projeto conceito de Gustavo Walien. Empresa, pessoas, números e depoimentos fictícios.", com link para `autor.portfolio`. Esse link é https://github.com/GustavoWalien até o portfólio estar no ar.

### Botão flutuante e aviso do WhatsApp

- **Botão flutuante:** redondo e amarelo, com contorno e sombra dura, no canto inferior direito. Na Início, aparece só depois que o hero termina.
- **Comportamento dos botões de WhatsApp:**
  - no modo conceito, todos abrem o **aviso**, com o texto definido em `docs/textos.md`;
  - fora do modo conceito, abrem direto o WhatsApp da empresa.
- **O aviso:**
  - é um `<dialog>` nativo aberto com `showModal()`;
  - o foco vai para "Falar com quem fez este site";
  - fecha com Esc, com o clique fora da janela e com "Continuar vendo o site", e o foco volta ao botão de origem;
  - fica num único componente no layout raiz.
- **Sem JavaScript:** os links são `<a href>` reais (para o `wa.me` do autor no modo conceito), então funcionam mesmo assim. O JavaScript só intercepta o clique para mostrar o aviso antes.

## 4. Página Início

Ordem das seções. Duas seções vizinhas nunca usam o mesmo esqueleto de layout.

1. **Hero** (seção 6).
2. **O que a gente faz:** 4 cartões (casa, empresa, campo, limpeza), cada um com ilustração pequena e link para a página do serviço.
3. **Simulador** (seção 7): painel dividido, com a entrada em azul-céu claro e os resultados em cartões.
4. **Como funciona:** 4 passos em linha, ligados pelo **pontilhado amarelo do caminho do sol**, que se desenha quando a seção entra na tela.
5. **O que a gente promete:** 4 promessas em grade 2×2, com ícones ilustrados.
6. **Depoimentos:** 3 balões de fala, com a nota "Depoimentos ilustrativos de um projeto conceito".
7. **Perguntas frequentes:** as 8 perguntas, em `<details>`/`<summary>` estilizados.
8. **Chamada final:** bloco azul-profundo com "Mande uma foto da sua conta de luz." e o botão de WhatsApp, ao lado do formulário.

**Elemento assinatura: "o dia do sol".** O caminho pontilhado do sol, com as marcas de horário, e o relógio que vai de 05:40 a 12:00 no hero. O mesmo pontilhado reaparece ligando os passos de "Como funciona", com o mesmo traço amarelo de contorno azul.

**Momento interativo:** o simulador.

## 5. Direção visual

- **Tokens.** Cores no `@theme` do Tailwind, em `app/globals.css`: `ipe`, `ceu-claro`, `ceu`, `profundo`, `mata` e `papel`. As cores de cenário (céus, morros, telhado) ficam só nos componentes do hero.
- **Tipografia**, pelo `next/font/google`, servida pelo próprio site:
  - Bricolage Grotesque 600 e 800 para títulos;
  - Figtree 400, 500 e 600 para textos;
  - JetBrains Mono 500 para rótulos.
- **Forma:**
  - contorno de 2,5 px azul-profundo em cartões, botões e campos;
  - sombra dura `0 5px 0` azul-profundo;
  - raio de 16 a 22 px;
  - fundo nunca branco puro (off-white `#FAFAF5`).
- **Destaque de palavra:**
  - sobre fundo escuro, a palavra fica amarela;
  - sobre fundo claro, o texto continua azul-profundo, com um marca-texto amarelo que se desenha (`background-size` guiado por `--k`);
  - amarelo e azul-céu nunca são cor de texto sobre fundo claro.
- **Movimento:**
  - entradas suaves com IntersectionObserver;
  - só `transform` e `opacity` animam;
  - duas curvas de easing como tokens;
  - movimento reduzido respeitado ao vivo, nas duas direções.
- **Ilustrações:** feitas em SVG, no código:
  - retratos da equipe;
  - ícones dos serviços e das promessas;
  - capas do blog;
  - mapa desenhado;
  - 404.

## 6. Hero

Port do protótipo v4. As constantes do protótipo (faixas de tempo, cores, caminhos) viram constantes nomeadas no código. O comportamento é o mesmo.

- **Estrutura:**
  - palco `sticky` de uma tela dentro de uma seção de 450vh;
  - céu em quatro camadas que se misturam (madrugada, nascer, manhã, meio-dia), estrelas e lua;
  - caminho do sol com marcas "07:00" e "09:00";
  - sol (halo, raios girando, disco), nuvens e tuiuiú;
  - quatro camadas de paisagem em SVG com paralaxe (longe 0,15, meio 0,35, perto 0,6, frente 1);
  - sombra da madrugada e brilho do nascer por cima da paisagem;
  - faixas de texto e painel de hora e kW.
- **Faixas de texto** (progresso de 0 a 1): madrugada `[0, 0.24]`, manhã `[0.36, 0.64]`, meio-dia `[0.72, 1]`. Os textos vêm de `content/inicio.ts`:
  - o rótulo "Energia solar em Cuiabá" faz parte do H1;
  - os botões finais são "Peça seu orçamento" e "Simule sua economia" (esse leva ao simulador).
- **Servidor e navegador:**
  - o componente `Hero` (servidor) gera todo o SVG e todo o texto no HTML, já calculados: estrelas, raios, placas e pétalas;
  - um único componente cliente, `MotorDoHero`, liga um loop `requestAnimationFrame` que descansa quando chega ao alvo e escreve no DOM só quando o valor muda;
  - nenhum estado React muda por quadro.
- **Regras de desempenho** (aprendidas no protótipo):
  - por quadro, só mudam `transform`, `opacity` e atributos de elementos pequenos (placas, sombras, ponteiro);
  - **nada de `filter` CSS animado**: ele derrubou o protótipo para 17% de quadros lentos;
  - camadas grandes com `will-change: transform`;
  - textos do painel atualizados no máximo 10 vezes por segundo.
- **Celular:** retrato com enquadramento `780 300 750 600` e `xMidYMax meet`; paisagem com `xMaxYMax slice`, para a casa nunca sair da tela. Como o servidor não sabe a orientação, as camadas da cena começam invisíveis e surgem num fade de 300 ms quando o motor aplica o enquadramento. O texto aparece na hora, porque é o maior elemento visível.
- **Movimento reduzido:** o hero fica com uma tela de altura e mostra a cena parada no meio-dia, sem loop. A troca acontece ao vivo, se a preferência mudar.
- **Sem JavaScript:** `@media (scripting: none)` mostra o meio-dia, com a faixa final e o hero de uma tela.
- **Fora da tela:** as animações em loop pausam (classe `pausado`), e tudo pausa com a aba escondida.

## 7. Simulador

- **Conta**, função pura `estimar(conta, constantes)` em `lib/simulador.ts`:
  1. consumo = conta ÷ tarifa;
  2. compensável = consumo − taxa mínima (piso 0);
  3. placas = arredondar para cima (compensável ÷ (geração por kWp por dia × 30) × 1000 ÷ potência da placa), no mínimo 1;
  4. kWp = placas × potência ÷ 1000;
  5. economia = compensável × tarifa × (1 − perda do Fio B);
  6. resultado em faixa de ±7%, por mês e por ano.
- **Constantes** em `content/simulador.ts`, cada uma com a fonte em comentário:

  | Constante | Valor | Observação |
  |---|---|---|
  | Tarifa | R$ 1,15/kWh | Estimativa com impostos. A B1 da Energisa MT é R$ 0,899 sem impostos desde 08/04/2026 |
  | Taxa mínima | 50 kWh | Ligação bifásica |
  | Geração | 4,3 kWh por kWp por dia | Valor conservador para Cuiabá. Confirmar no SunData do CRESESB |
  | Placa | 585 W | |
  | Perda do Fio B em 2026 | 15% | |
  | Margem da faixa | 7% | |

- **Referência de teste:** R$ 450 dá 5 placas, 2,9 kWp e R$ 310 a R$ 357 por mês. R$ 1.200 dá 14 placas e R$ 903 a R$ 1.039.
- **Interface:**
  - deslizador de R$ 150 a R$ 3.000 (passo 10, começa em 450), com `aria-valuetext` "R$ 450 por mês";
  - resultados num `aria-live="polite"`;
  - "Como essa conta é feita" num `<details>`;
  - o botão "Quero a simulação completa" leva ao WhatsApp com a mensagem "Olá! Minha conta de luz fica em torno de R$ {valor}. Quero uma simulação.". No modo conceito, abre o aviso.

## 8. Formulário e e-mail

- **Campos:**

  | Campo | Regra |
  |---|---|
  | Nome | Obrigatório, 2 a 80 caracteres |
  | WhatsApp com DDD | 10 ou 11 dígitos depois de normalizar; aceita +55 |
  | Cidade e bairro | Opcional, até 80 |
  | Valor médio da conta | Até R$ 300 · R$ 300 a R$ 600 · R$ 600 a R$ 1.000 · Mais de R$ 1.000 |
  | Onde quer instalar | Casa · Empresa · Fazenda ou sítio |
  | Mensagem | Opcional, até 1.000 |

  Há ainda dois campos escondidos: o campo armadilha `site`, que precisa vir vazio, e o tempo de página `tempo`, em milissegundos desde que a página começou a carregar, medido no navegador no momento do envio. O servidor não compara relógios, então um relógio adiantado no computador do visitante não faz o pedido sumir (decidido na revisão do Plano 2). Sem JavaScript, o campo fica vazio e só a armadilha protege.
- **Fluxo:**
  1. `FormularioPedido` (cliente, `useActionState`) envia para a ação `enviarPedido` em `app/actions/pedido.ts`.
  2. A validação pura fica em `lib/pedido.ts` e devolve os erros por campo, com as mensagens de `docs/textos.md`.
  3. O envio fica em `lib/email.ts`.
  4. O formulário funciona sem JavaScript, por envio nativo.
- **Antispam:**
  - campo armadilha preenchido ou envio com menos de 3 segundos: a ação devolve sucesso sem enviar, para não dar pista ao robô;
  - limitar envios por número de acessos fica fora do escopo.
- **E-mail:**
  - assunto "Pedido de orçamento: {nome} ({onde})", corpo em texto simples com todos os campos e o endereço do site;
  - destino: o e-mail do autor no modo conceito, o da empresa fora dele;
  - remetente: `onboarding@resend.dev` no modo conceito (o Resend sem domínio verificado só entrega para o dono da conta, que é o autor); para cliente real, um domínio verificado;
  - o código do Resend segue a skill do provedor que a integração instala, sem escrever de memória;
  - dados pessoais nunca vão para o log.
- **Testes:** com `EMAIL_TRANSPORTE=teste`, nada sai para a rede. Esse transporte devolve sucesso e simula falha quando o nome é "Teste Falha".
- **Estados na tela:**
  - erros por campo com `aria-invalid` e `aria-describedby`, e foco no primeiro erro;
  - botão "Enviando…" desabilitado;
  - erro de envio num `role="alert"`;
  - sucesso num `role="status"`, com a variante do modo conceito.

## 9. Mapa (Contato)

- **Cartão desenhado:** mapa ilustrado em SVG, com o rio Cuiabá, ruas e um pino, mais a etiqueta "Cuiabá-MT · atendimento no local com hora marcada". Tem o mesmo tamanho do mapa real, para nada pular.
- **Carregamento:** quando o cartão chega a 300 px da tela, entra o iframe `https://www.google.com/maps?q={consulta}&z=12&output=embed`, com `title`, num fade.
- **Consulta:** `Cuiabá, MT` no modo conceito, sem pino em endereço real.
- **Alternativa:** o link "Abrir no Google Maps" fica sempre visível.

## 10. Blog

- **MDX:**
  - `@next/mdx` com `remarkPlugins: ['remark-gfm']`, por nome, por causa do Turbopack, para as tabelas;
  - `mdx-components.tsx` na raiz, obrigatório no App Router.
- **Artigos:** `content/blog/<slug>.mdx`, cada um exportando `metadata` com:
  - `titulo`, `descricao`;
  - `data` (ISO);
  - `leitura` (minutos);
  - `capa` (`fiob`, `seca` ou `creditos`);
  - `fontes` (`{ nome, url }[]`).
- **Índice:** `content/blog/index.ts` mapeia cada slug para o seu import. O `lib/blog.ts` lista por data, do mais novo para o mais antigo.
- **Página do artigo:**
  - trilha de navegação, data e tempo de leitura, H1 e corpo com tipografia própria;
  - componentes MDX: `NaPratica`, `ChamadaOrcamento` e `Simulador`, este embutido no fim do artigo 1;
  - lista de fontes no fim.
- **Lista:** cartões com capa ilustrada (componente `Capa`, um SVG por chave), tempo de leitura, título, descrição e "Ler artigo →".
- **Conteúdo:** 3 artigos completos, de 700 a 900 palavras cada, seguindo os roteiros e as regras de texto. A tabela do Fio B vai de 2025 a 2028 (45%, 60%, 75%, 90%), e 2029 aparece como "regra final definida pela ANEEL". O cronograma é conferido no texto da Lei 14.300 antes de publicar.

## 11. SEO e compartilhamento

- **Metadados:**
  - `metadataBase` vem de `SITE_URL` em `lib/site.ts`, igual ao portfólio (`NEXT_PUBLIC_SITE_URL`, senão `VERCEL_PROJECT_PRODUCTION_URL`);
  - título com `template: '%s | Ipê Solar'`, e o conteúdo guarda o título sem o sufixo;
  - descrição, canônico, `openGraph` (`pt_BR`) e `twitter: summary_large_image` em cada página;
  - um teste confere que o título final tem até 60 caracteres e a descrição até 160.
- **Arquivos:**
  - `app/sitemap.ts`, com todas as rotas, serviços e artigos (artigos com a própria data);
  - `app/robots.ts`, liberando tudo e apontando o sitemap;
  - `app/icon.svg` (a flor) e `app/apple-icon.png`.
- **Dados estruturados**, montados por funções puras em `lib/jsonld.ts` e serializados com `<` escapado:

  | Página | Tipos |
  |---|---|
  | Início | `LocalBusiness` e `FAQPage` |
  | Serviço | `Service` (provedor: o negócio), `BreadcrumbList` e `FAQPage` |
  | Sobre e Contato | `LocalBusiness` e `BreadcrumbList` |
  | Artigo | `BlogPosting` e `BreadcrumbList` |

  No modo conceito, o `LocalBusiness` não leva telefone nem rua: só cidade, estado, país, áreas atendidas e horário.
- **Imagens de compartilhamento:**
  - Início: `app/opengraph-image.png` (1200×630), gerada pelo script `scripts/og.mjs` a partir do hero real no meio-dia, com a placa e "Energia solar em Cuiabá.". É a mesma composição aprovada na parte 3;
  - cada artigo: `app/blog/[slug]/opengraph-image.tsx` com `ImageResponse`, usando a fonte Bricolage guardada no projeto (licença OFL), gerada no build para os 3 slugs;
  - as outras páginas herdam a imagem da Início.

## 12. Arquitetura técnica

```
app/
  layout.tsx                 fontes, metadados base, barra, rodapé, WhatsApp flutuante, aviso
                             export const ensureStatic = 'navigation'  (o site inteiro sai pronto no build)
  page.tsx                   Início
  servicos/page.tsx          lista
  servicos/[slug]/page.tsx   serviço
  sobre/page.tsx
  contato/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  blog/[slug]/opengraph-image.tsx
  not-found.tsx
  actions/pedido.ts          ação do servidor do formulário
  sitemap.ts · robots.ts · icon.svg · apple-icon.png · opengraph-image.png
  globals.css                tokens (@theme), base, utilitários
components/
  layout/   BarraTopo (cliente) · Rodape · WhatsappFlutuante (cliente) · AvisoConceito (cliente) · LinkWhatsapp
  hero/     Hero (servidor) · camadas/* (servidor) · MotorDoHero (cliente) · geometria.ts
  inicio/   OQueFazemos · Simulador (cliente) · ComoFunciona · Promessas · Depoimentos · Perguntas · ChamadaFinal
  contato/  FormularioPedido (cliente) · Mapa (cliente)
  servicos/ PaginaServico · CartaoServico
  sobre/    Equipe · Retrato (SVG por pessoa)
  blog/     CartaoArtigo · Capa · NaPratica · ChamadaOrcamento
  ui/       Botao · Rotulo · Secao · Revelar (cliente: entrada ao aparecer)
content/
  config.ts       modoConceito; autor: Gustavo Walien, WhatsApp 55 65 98122-2210, gustavowalien@gmail.com, portfólio
  empresa.ts      nome, frase, contatos, horário, cidades, números, consulta do mapa
  inicio.ts · servicos.ts · equipe.ts · depoimentos.ts · perguntas.ts · simulador.ts · tipos.ts
  blog/*.mdx · blog/index.ts
lib/
  site.ts · simulador.ts · pedido.ts · email.ts · whatsapp.ts · contato.ts · jsonld.ts · blog.ts
mdx-components.tsx
scripts/og.mjs     imagem de compartilhamento da Início e apple-icon, gerados do hero real
tests/unit/*.test.ts · tests/e2e/*.spec.ts
CONTEUDO.md        guia para trocar para outro cliente
README.md
```

- **Componentes de cliente**, só estes:
  - `BarraTopo` (estados e menu);
  - `MotorDoHero`;
  - `Simulador`;
  - `AvisoConceito`;
  - `WhatsappFlutuante`;
  - `FormularioPedido`;
  - `Mapa`;
  - `Revelar`.

  Todo o resto é de servidor e sai como HTML estático.
- **Dependências novas:**
  - `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` e `remark-gfm`;
  - `resend`, instalado conforme a skill do provedor depois da integração;
  - para desenvolvimento, `vitest` e `@playwright/test`.
- **Configuração:** o `next.config.ts` mantém `cacheComponents` e `partialPrefetching`, e ganha o `createMDX`. O Tailwind entra pelo PostCSS (`postcss.config.mjs` com `@tailwindcss/postcss`), como manda a documentação do Next 16. A antiga regra `*.css` do Turbopack (`@tailwindcss/turbopack`) não acompanhava as edições do `globals.css` no `next dev` e foi removida no Plano 1, então ela não deve voltar.
- **Variáveis de ambiente:**
  - a chave do Resend, que a integração cria (o nome vem da integração, normalmente `RESEND_API_KEY`; o código usa o nome que ela definir);
  - `EMAIL_TRANSPORTE`, só nos testes;
  - `NEXT_PUBLIC_SITE_URL`, opcional.

  O modo conceito fica no código (`content/config.ts`), porque faz parte do modelo.

## 13. Piso de qualidade

- **Contraste:** 4,5:1 em textos e 3:1 em textos grandes e bordas de interface. Um teste confere os pares da paleta.
- **Estrutura da página:**
  - link "Pular para o conteúdo";
  - marcos `header`, `nav`, `main` e `footer`;
  - um H1 por página e títulos em ordem.
- **Interação:**
  - foco visível em amarelo;
  - alvos de toque de pelo menos 44 px no celular;
  - `overflow-x: clip` em `html` e `body`.
- **Texto:**
  - sem travessão e sem as palavras proibidas (alavancar, robusto, empoderar, destravar, acionável, orientado a dados, solução, soluções, sinergia, escalável), conferido por teste em `content/` e nos MDX;
  - textos reais no HTML, desenhos decorativos com `aria-hidden`.
- **Erros:** zero no console, no computador e no celular.
- **Metas de velocidade:**
  - Lighthouse 95+ nas quatro notas;
  - página principal visível em menos de 2 s no celular simulado;
  - CLS perto de 0;
  - no máximo 2% de quadros acima de 33 ms no hero. **Pendente para o Plano 6:** neste ambiente sem GPU (WSL), a medida varia com a carga da máquina. Sozinho, o port fica entre 0,9% e 1,9% acima de 33 ms; depois da bateria inteira, chegou a 6,6%, e o protótipo aprovado, por script, de 2,3% a 3,2%. A meta de 33 ms é conferida no aparelho de verdade, com o site no ar. O teste local vigia a regressão: no máximo 2% acima de 50 ms e, como alarme relativo, no máximo 10% acima de 33 ms.

## 14. Testes

- **Vitest** (`tests/unit`):
  - simulador, com os casos de referência da seção 7 e os limites R$ 150 e R$ 3.000;
  - validação do formulário, incluindo o campo armadilha e o tempo mínimo;
  - links de WhatsApp nos dois modos;
  - dados estruturados (sem telefone no modo conceito);
  - integridade do conteúdo: slugs únicos, campos obrigatórios e tamanhos de título e descrição;
  - índice do blog contra os arquivos e metadados completos;
  - regras de texto;
  - contraste da paleta.
- **Playwright** (`tests/e2e`), contra `next build && next start` com `EMAIL_TRANSPORTE=teste`, num projeto de computador (1440×900) e num de celular (375×812):
  - hero: H1 e faixas, relógio de 05:40 a 12:00, placas acesas no fim, estados da barra e botão flutuante escondido durante o hero;
  - movimento reduzido: cena final e hero de uma tela;
  - aviso: abre pela barra, pelo flutuante e pelo simulador, recebe o foco, fecha com Esc e devolve o foco, com o link do autor certo;
  - simulador: arrastar muda os números;
  - formulário: erros, sucesso (variante conceito) e falha;
  - mapa: sem iframe até chegar perto;
  - menu do celular;
  - SEO de cada rota: título, descrição, `og:image`, canônico e dados estruturados válidos, além de sitemap, robots e status 404;
  - qualidade: zero erros no console, sem rolagem lateral em 375 e 1440 px, link de pular funcionando;
  - desempenho: quadros lentos no hero durante uma rolagem roteirizada, só no Chromium, num projeto próprio que roda sozinho depois dos outros (veja a meta na seção 13).
- **Comando:** `npm run test:all` roda tudo.
- **Lighthouse:** Início, `/servicos/energia-solar-residencial` e um artigo, no celular e no computador. Os relatórios ficam em `.lighthouse/` (fora do Git), e o print vai para o portfólio.

## 15. Publicação

| Passo | Quem | O quê |
|---|---|---|
| 1 | Você (ou eu, com o seu ok na hora) | Repositório público `site-energia-solar` no GitHub |
| 2 | Você | Login na Vercel e projeto ligado ao repositório, com endereço `ipe-solar.vercel.app` se livre |
| 3 | Você | Integração `resend/resend-email` do Marketplace, aceitando a conta e os termos |
| 4 | Eu | `vercel env pull`, modo conceito ligado, e-mail do autor como destino, primeira publicação |
| 5 | Automático | Prévia por envio ao GitHub; a `main` vai para o endereço oficial |
| 6 | Eu | Conferir no ar: formulário real chegando, Lighthouse no endereço real, print, README e o projeto no portfólio (`content/projects.ts`), tirando primeiro o provisório "Ledger" |

Ações para fora do computador (criar repositório, publicar, ligar integração) sempre esperam o ok do usuário na hora.

## 16. Modelo: trocar para outro cliente

O `CONTEUDO.md` explica, nesta ordem:
1. Editar `content/empresa.ts` (nome, contatos, cidades, números) e `content/config.ts` (desligar `modoConceito`).
2. Trocar as cores no `@theme` de `app/globals.css`.
3. Reescrever `inicio.ts`, `servicos.ts`, `equipe.ts`, `depoimentos.ts` e `perguntas.ts`, mantendo as regras de texto.
4. Ajustar `content/simulador.ts` à distribuidora e à região do cliente.
5. Trocar ou tirar os artigos do blog.
6. Ajustar o hero: os elementos de Cuiabá (Chapada, tuiuiú, ipê) estão isolados em componentes de camada, para trocar sem mexer no motor.
7. Gerar de novo a imagem de compartilhamento (`node scripts/og.mjs`) e rodar `npm run test:all`.

## 17. Fora do escopo

- Painel de edição (CMS) e versão em inglês.
- Domínio próprio, para depois.
- Analytics. A Vercel Speed Insights pode entrar depois.
- Agendamento online, chat ao vivo e pagamentos.
- Simulador com bateria.
- Antispam avançado, como limite por acesso ou BotID. Fica para o primeiro cliente real.
- Tema escuro.
