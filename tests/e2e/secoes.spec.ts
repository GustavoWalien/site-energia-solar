import { expect, test } from "@playwright/test";

test.describe("seções da Início", () => {
  test("O que a gente faz: quatro cartões que levam às páginas de serviço", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#o-que-fazemos");
    await expect(secao.getByRole("heading", { level: 2 })).toHaveText("Do telhado da casa ao pivô da fazenda.");
    await expect(secao.getByRole("listitem")).toHaveCount(4);
    await secao.getByRole("link", { name: "Energia solar para casa" }).click();
    await expect(page).toHaveURL(/\/servicos\/energia-solar-residencial$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Energia solar para casa em Cuiabá");
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
});

test.describe("seções sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("os passos de Como funciona aparecem sem esperar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#como-funciona li").first()).toHaveCSS("opacity", "1");
  });
});
