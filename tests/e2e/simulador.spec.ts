import { expect, test } from "@playwright/test";

test.describe("simulador", () => {
  test("começa em R$ 450 e muda os números ao arrastar", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#simulador");
    const deslizador = secao.getByRole("slider", { name: "Valor médio da sua conta de luz" });
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 450 por mês");
    await expect(secao).toContainText("5 placas · 2,9 kWp");
    await expect(secao).toContainText("R$ 310 a R$ 357 por mês");
    await deslizador.fill("1200");
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 1.200 por mês");
    await expect(secao).toContainText("14 placas · 8,2 kWp");
    await expect(secao).toContainText("R$ 903 a R$ 1.039 por mês");
    await expect(secao).toContainText("R$ 10.836 a R$ 12.468");
  });

  test("as setas do teclado andam de 10 em 10", async ({ page }) => {
    await page.goto("/");
    const deslizador = page.locator("#simulador").getByRole("slider");
    await deslizador.focus();
    await page.keyboard.press("ArrowRight");
    await expect(deslizador).toHaveAttribute("aria-valuetext", "R$ 460 por mês");
  });

  test("os resultados ficam numa região que avisa o leitor de tela", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#simulador [aria-live='polite']")).toContainText("Economia estimada");
  });

  test("o botão leva ao WhatsApp do autor e abre o aviso do projeto conceito", async ({ page }) => {
    await page.goto("/");
    const botao = page.getByRole("link", { name: "Quero a simulação completa" });
    await expect(botao).toHaveAttribute("href", /^https:\/\/wa\.me\/5565981222210\?text=/);
    await botao.click();
    await expect(page.getByRole("dialog", { name: "Este é um projeto conceito." })).toBeVisible();
  });
});

test.describe("simulador sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mostra a estimativa de R$ 450", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#simulador")).toContainText("R$ 310 a R$ 357 por mês");
  });
});
