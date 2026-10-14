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
