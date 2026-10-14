import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test("o H1 junta o rótulo e o título da madrugada, e as três faixas estão no HTML", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", {
      level: 1,
      name: /^Energia solar em Cuiabá\s*Em Cuiabá, o sol chega cedo\.$/,
    });
    await expect(h1).toHaveCount(1);
    await expect(page.locator("[data-faixa]")).toHaveCount(3);
    await expect(page.locator(".hero__faixa--final")).toContainText("A gente faz o projeto");
    await expect(page.locator("[data-placa]")).toHaveCount(8);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
  });
});

test.describe("hero sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mostra o meio-dia numa tela, com os botões finais", async ({ page }) => {
    await page.goto("/");
    const caixa = await page.locator("#hero").boundingBox();
    expect(caixa!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
    const final = page.locator(".hero__faixa--final");
    await expect(final).toHaveCSS("opacity", "1");
    await expect(final.getByRole("link", { name: "Peça seu orçamento" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/5565981222210/,
    );
    await expect(final.getByRole("link", { name: "Simule sua economia" })).toHaveAttribute("href", "#simulador");
    await expect(page.locator(".hero__ceu--dia")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero__faixa--1")).toHaveCSS("opacity", "0");
  });
});
