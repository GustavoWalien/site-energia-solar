# Ipê Solar

Site de uma empresa fictícia de energia solar em Cuiabá-MT. É um projeto conceito do portfólio de Gustavo Walien e também um modelo: dá para trocar para uma empresa de verdade mexendo só em conteúdo e cores.

**No ar:** https://ipe-solar.vercel.app

## O que tem

- **Hero ilustrado guiado pela rolagem:** o dia nasce sobre Cuiabá, o sol percorre o céu e as placas do telhado acendem. É tudo em SVG, com um motor próprio que só anima `transform` e `opacity`.
- **Simulador de economia:** do valor da conta de luz para o número de placas e a economia por mês e por ano, com as regras do Fio B de 2026.
- **4 páginas de serviço**, Sobre, Contato com mapa e um **blog com 3 artigos** em MDX.
- **Pedido de orçamento** pelo WhatsApp ou pelo formulário, que chega por e-mail pelo Resend.
- **Pensado para o Google e para o WhatsApp:** canônico, Open Graph, imagem de compartilhamento por página, sitemap, robots e dados estruturados (LocalBusiness, Service, FAQPage, BlogPosting).
- **Modo conceito:** os contatos vão para o autor, e o site avisa que a empresa é fictícia.

## Stack

Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript, Tailwind CSS 4, MDX, Resend, Vitest e Playwright. Publicado na Vercel.

## Rodar no computador

Precisa do Node.js 24.

```bash
npm install
vercel env pull .env.local   # a chave do Resend, com o projeto ligado pelo `vercel link`
npm run dev
```

Com o `.env.local`, o formulário do `npm run dev` envia e-mail de verdade. Sem ele, o envio falha com um aviso no log.

## Testes

```bash
npm test            # Vitest: simulador, formulário, e-mail, SEO, dados estruturados, textos, contraste
npm run test:e2e    # Playwright no build de produção, no computador (1440 px) e no celular (375 px)
npm run test:all    # os dois
```

Os testes nunca enviam e-mail: o Playwright sobe o servidor com `EMAIL_TRANSPORTE=teste`.

Para o Lighthouse (relatórios em `.lighthouse/`, fora do Git):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3300 npm run build && npx next start -p 3300
npm run lighthouse -- http://localhost:3300
```

## Onde fica cada coisa

- Textos, dados da empresa e constantes do simulador: `content/`. A fonte de todos os textos é `docs/textos.md`.
- Hero: `components/hero/` (as camadas do desenho em `components/hero/camadas/`).
- Envio do pedido: `app/actions/pedido.ts` e `lib/email.ts`.
- SEO e dados estruturados: `lib/seo.ts`, `lib/jsonld.ts` e `lib/rotas.ts`.
- Imagem de compartilhamento da Início e ícone da Apple: gerados por `scripts/og.mjs`.
- Design e decisões: `docs/superpowers/specs/2026-10-13-site-ipe-solar-design.md`.

## Trocar para outro cliente

O passo a passo está em `CONTEUDO.md`.
