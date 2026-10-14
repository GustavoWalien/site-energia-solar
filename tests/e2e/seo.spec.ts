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

test("trilha da Sobre e da Contato nos dados estruturados: Início e a página", async ({ page }) => {
  for (const [rota, nome] of [
    ["/sobre", "Sobre"],
    ["/contato", "Contato"],
  ]) {
    await page.goto(rota);
    const blocos = await page.locator('script[type="application/ld+json"]').allTextContents();
    const trilha = blocos.map((b) => JSON.parse(b)).find((d) => d["@type"] === "BreadcrumbList");
    expect(trilha.itemListElement.map((i: { name: string }) => i.name)).toEqual(["Início", nome]);
  }
});
