import { expect, test, type Page } from "@playwright/test";

/**
 * Abre o aviso clicando no botão flutuante. Antes da hidratação, o link segue direto para o WhatsApp (o comportamento
 * sem JavaScript, de propósito), então o clique se repete até o aviso abrir.
 */
async function abrirAviso(page: Page, clicar: () => Promise<void>) {
  await expect(async () => {
    await clicar();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
  }).toPass();
}

const LINK_AUTOR =
  "https://wa.me/5565981222210?text=Ol%C3%A1!%20Vi%20o%20site%20conceito%20da%20Ip%C3%AA%20Solar%20e%20quero%20conversar%20sobre%20um%20site%20para%20o%20meu%20neg%C3%B3cio.";

test.describe("WhatsApp no modo conceito", () => {
  test("o botão flutuante abre o aviso com foco no contato do autor, e o Esc devolve o foco", async ({ page }) => {
    await page.goto("/sobre");
    const flutuante = page.locator("#whatsapp-flutuante");
    // clique que não move o foco, como no Safari: quem devolve o foco é o próprio aviso
    await abrirAviso(page, () => flutuante.dispatchEvent("click"));
    const aviso = page.getByRole("dialog", { name: "Este é um projeto conceito." });
    await expect(aviso).toBeVisible();
    const autor = aviso.getByRole("link", { name: "Falar com quem fez este site" });
    await expect(autor).toBeFocused();
    await expect(autor).toHaveAttribute("href", LINK_AUTOR);
    await page.keyboard.press("Escape");
    await expect(aviso).toBeHidden();
    await expect(flutuante).toBeFocused();
  });

  test("fecha pelo botão de continuar e pelo clique fora da janela", async ({ page }) => {
    await page.goto("/sobre");
    const aviso = page.getByRole("dialog");
    await abrirAviso(page, () => page.locator("#whatsapp-flutuante").click());
    await aviso.getByRole("button", { name: "Continuar vendo o site" }).click();
    await expect(aviso).toBeHidden();
    await page.locator("#whatsapp-flutuante").click();
    await expect(aviso).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(aviso).toBeHidden();
  });

  test("com o menu do celular aberto, o WhatsApp fecha o menu e abre o aviso", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await page.locator("summary[aria-label='Menu']").click();
    await page.getByRole("banner").getByRole("link", { name: "Fale no WhatsApp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Menu" })).toBeHidden();
  });
});

test.describe("rodapé", () => {
  test("mostra horário, cidades e a linha de projeto conceito com o portfólio", async ({ page }) => {
    await page.goto("/");
    const rodape = page.getByRole("contentinfo");
    await expect(rodape).toContainText("Segunda a sexta, das 7h às 17h");
    await expect(rodape).toContainText("Várzea Grande");
    await expect(rodape).toContainText("Projeto conceito de Gustavo Walien");
    await expect(rodape.getByRole("link", { name: "Ver portfólio" })).toHaveAttribute(
      "href",
      "https://github.com/GustavoWalien",
    );
  });

  test("a flor do rodapé tem contorno e miolo visíveis no azul", async ({ page }) => {
    await page.goto("/sobre");
    const miolo = page.locator(".rodape__flor circle");
    expect(await miolo.evaluate((el) => getComputedStyle(el).fill)).toBe("rgb(245, 184, 0)");
  });

  test("no celular, os links do rodapé têm 44 px de altura", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/sobre");
    const alturas = await page
      .getByRole("contentinfo")
      .getByRole("link")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    expect(alturas.length).toBeGreaterThan(0);
    for (const altura of alturas) expect(altura).toBeGreaterThanOrEqual(44);
  });
});

test("o botão de fechar do aviso usa o papel, não o branco puro", async ({ page }) => {
  await page.goto("/sobre");
  await abrirAviso(page, () => page.locator("#whatsapp-flutuante").click());
  const fechar = page.getByRole("dialog").getByRole("button", { name: "Fechar aviso" });
  expect(await fechar.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(250, 250, 245)");
});
