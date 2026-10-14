/* global document, getComputedStyle */
// Gera app/opengraph-image.png (1200 × 630) e app/apple-icon.png (180 × 180) a partir do site de verdade.
// A imagem da Início é a cena do meio-dia do hero (com movimento reduzido, o hero fica parado no meio-dia),
// com a placa e o título por cima. O nome, a flor e o título vêm da própria página, então outro cliente só
// precisa rodar o script de novo.
// Uso, com o site rodando:
//   npm run build && npx next start -p 3300
//   node scripts/og.mjs http://localhost:3300
import { chromium } from "@playwright/test";
import { dividirTitulo } from "./titulo-og.mjs";

const base = process.argv[2] ?? "http://localhost:3300";

const ESTILO = `
  .topo, .hero__faixas, .hero__painel, .hero__dica, .flutuante, .pular { display: none !important; }
  .og { position: fixed; inset: 0; z-index: 50; pointer-events: none; font-family: var(--fonte-display); color: var(--color-profundo); }
  .og__placa { position: absolute; left: 64px; top: 0; display: flex; align-items: center; gap: 12px;
    padding: 30px 26px 22px; background: var(--color-ipe); border: 4px solid var(--color-profundo); border-top: 0;
    border-radius: 0 0 24px 24px; box-shadow: 0 8px 0 var(--color-profundo); font-weight: 800; font-size: 44px; letter-spacing: -0.01em; }
  .og__placa svg { width: 46px; height: 46px; }
  .og__titulo { position: absolute; left: 64px; top: 190px; max-width: 560px; margin: 0; font-weight: 800;
    font-size: 76px; line-height: 0.96; letter-spacing: -0.03em; }
  .og__titulo em { font-style: normal; background: linear-gradient(var(--color-ipe), var(--color-ipe)) no-repeat 0 88% / 100% 0.28em; }
`;

const navegador = await chromium.launch();

// 1. imagem da Início
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
await pagina.goto(`${base}/`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
// as camadas da cena surgem num fade de 300 ms depois que o motor aplica o enquadramento
await pagina.waitForTimeout(1200);
await pagina.addStyleTag({ content: ESTILO });
const { nome, flor, rotulo, ipe, profundo } = await pagina.evaluate(() => {
  // as cores do @theme (app/globals.css), para o ícone, que é montado fora do site
  const tema = getComputedStyle(document.documentElement);
  const cor = (nome) => tema.getPropertyValue(nome).trim();
  return {
    nome: document.querySelector(".topo__nome").textContent.trim(),
    flor: document.querySelector(".topo__flor").outerHTML,
    rotulo: document.querySelector(".hero__rotulo").textContent,
    ipe: cor("--color-ipe"),
    profundo: cor("--color-profundo"),
  };
});
const { inicio, destaque } = dividirTitulo(rotulo);
await pagina.evaluate(
  ({ nome, flor, inicio, destaque }) => {
    const og = document.createElement("div");
    og.className = "og";
    og.innerHTML =
      `<div class="og__placa">${flor}<span>${nome}</span></div>` +
      `<p class="og__titulo">${inicio ? `${inicio} ` : ""}<em>${destaque}</em>.</p>`;
    document.body.append(og);
  },
  { nome, flor, inicio, destaque },
);
await pagina.waitForTimeout(300);
await pagina.screenshot({ path: "app/opengraph-image.png" });

// 2. ícone da Apple: a flor da placa sobre o amarelo ipê (o iPhone arredonda os cantos sozinho)
const icone = await navegador.newPage({ viewport: { width: 180, height: 180 } });
await icone.setContent(
  `<style>body{margin:0;height:180px;display:grid;place-items:center;background:${ipe};color:${profundo}}` +
    `svg{width:128px;height:128px}</style>${flor}`,
);
await icone.screenshot({ path: "app/apple-icon.png" });

await navegador.close();
console.log("app/opengraph-image.png e app/apple-icon.png gerados a partir de", base);
