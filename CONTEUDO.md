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
