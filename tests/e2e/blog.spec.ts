import { expect, test } from "@playwright/test";

const ARTIGOS = [
  [
    "energia-solar-vale-a-pena-2026-fio-b",
    "Energia solar ainda vale a pena em 2026? O que muda com o Fio B",
    "Energia solar vale a pena em 2026? O Fio B | Ipê Solar",
  ],
  [
    "placas-solares-geram-menos-na-seca",
    "Por que suas placas geram menos na seca (e o que fazer)",
    "Placas solares geram menos na seca: o que fazer | Ipê Solar",
  ],
  [
    "creditos-de-energia-energisa",
    "Créditos de energia: como a Energisa abate o que suas placas geram",
    "Créditos de energia: como a Energisa abate | Ipê Solar",
  ],
] as const;

test.describe("blog", () => {
  test("a lista mostra os três artigos, do mais novo para o mais antigo", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle("Blog sobre energia solar em Cuiabá | Ipê Solar");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog da Ipê Solar");
    await expect(page.locator(".artigos").getByRole("heading", { level: 2 })).toHaveText(ARTIGOS.map(([, h1]) => h1));
    await expect(page.locator(".artigos svg.cartao-artigo__capa")).toHaveCount(3);
    await page.getByRole("link", { name: /^Ler artigo\s*:\s*Por que suas placas/ }).click();
    await expect(page).toHaveURL(/\/blog\/placas-solares-geram-menos-na-seca$/);
  });

  for (const [slug, h1, titulo] of ARTIGOS) {
    test(`/blog/${slug}: título, trilha, data, corpo, fontes e orçamento`, async ({ page }) => {
      await page.goto(`/blog/${slug}`);
      await expect(page).toHaveTitle(titulo);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      const trilha = page.getByRole("navigation", { name: "Trilha" });
      await expect(trilha.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
      await expect(page.locator(".artigo__meta time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
      await expect(page.locator(".artigo__meta")).toContainText("4 min de leitura");
      await expect(page.locator(".artigo__corpo h2").first()).toBeVisible();
      await expect(page.locator(".artigo__corpo .na-pratica").first()).toContainText("Na prática");
      await expect(page.locator(".artigo__corpo .chamada-orcamento a")).toHaveAttribute("data-aviso", "");
      expect(await page.locator(".artigo__fontes a").count()).toBeGreaterThanOrEqual(2);
      await expect(page.locator("#orcamento form")).toHaveCount(1);
    });
  }

  test("o artigo do Fio B traz a tabela até 2028, a regra de 2029 e o simulador funcionando no texto", async ({ page }) => {
    await page.goto("/blog/energia-solar-vale-a-pena-2026-fio-b");
    const tabela = page.locator(".artigo__corpo table");
    await expect(tabela.locator("tbody tr")).toHaveCount(5);
    await expect(tabela).toContainText("regra final definida pela ANEEL");
    const simulador = page.locator(".artigo__corpo .simulador");
    await expect(simulador).toHaveCount(1);
    await simulador.getByRole("slider").fill("1200");
    await expect(simulador).toContainText("14 placas");
  });

  test("artigo que não existe: 404 com o título da 404", async ({ page }) => {
    const resposta = await page.goto("/blog/nao-existe");
    expect(resposta!.status()).toBe(404);
    await expect(page).toHaveTitle("Página não encontrada | Ipê Solar");
  });
});

test.describe("blog sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("o artigo vem inteiro no HTML, com o texto, as fontes e o formulário", async ({ page }) => {
    await page.goto("/blog/creditos-de-energia-energisa");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".artigo__corpo")).toContainText("cada crédito vale por 60 meses");
    await expect(page.locator(".artigo__fontes")).toBeVisible();
    await expect(page.locator("#orcamento form")).toBeVisible();
  });
});
