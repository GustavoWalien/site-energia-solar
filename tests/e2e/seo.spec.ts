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
