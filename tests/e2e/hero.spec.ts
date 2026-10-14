import { expect, test, type Page } from "@playwright/test";

/** Rola até o progresso p do hero (0 a 1). */
async function rolar(page: Page, p: number) {
  await page.evaluate((alvo) => {
    const hero = document.getElementById("hero")!;
    scrollTo(0, hero.offsetTop + (hero.offsetHeight - innerHeight) * alvo);
  }, p);
}

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

  test("o HTML do servidor já põe a casa inteira dentro da tela (faíscas no lugar, antes do motor)", async ({ page }) => {
    await page.goto("/");
    const casa = (await page.locator("#hero-casa").boundingBox())!;
    expect(casa.x).toBeGreaterThanOrEqual(0);
    expect(casa.x + casa.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
});

test.describe("hero com o motor", () => {
  test("no topo da Início: madrugada, barra transparente e sem botão flutuante", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toHaveClass(/hero--pronto/);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
    const topo = page.locator("#topo");
    await expect(topo).not.toHaveClass(/topo--solida/);
    await expect(topo).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator("#whatsapp-flutuante")).toBeHidden();
  });

  test("no fim do hero: meio-dia, placas acesas e barra com links azuis", async ({ page }) => {
    await page.goto("/");
    await rolar(page, 1);
    await expect(page.locator("#hero-hora")).toHaveText("12:00");
    await expect
      .poll(() => page.locator("[data-placa-luz]").evaluateAll((els) => els.map((el) => el.getAttribute("opacity"))))
      .toEqual(Array(8).fill("1.000"));
    await expect(page.locator("#topo")).toHaveClass(/topo--sobre-claro/);
    await expect(page.locator("#whatsapp-flutuante")).toBeHidden();
  });

  test("depois do hero: barra sólida, botão flutuante visível e cena pausada", async ({ page }) => {
    await page.goto("/");
    await page.locator("#simulador").scrollIntoViewIfNeeded();
    await expect(page.locator("#topo")).toHaveClass(/topo--solida/);
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
    await expect(page.locator("#hero-palco")).toHaveClass(/pausado/);
  });

  test("um link escondido do hero aparece quando recebe o foco do teclado", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hero__faixa--final .hero__link").focus();
    await expect(page.locator(".hero__faixa--final")).toHaveCSS("opacity", "1");
  });

  test("nas outras páginas a barra é sólida e o botão flutuante aparece", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
  });

  test("sair da Início e voltar sem recarregar recomeça o hero", async ({ page, isMobile }) => {
    test.skip(isMobile, "os links do topo ficam no menu do celular");
    await page.goto("/");
    await rolar(page, 0.5);
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/\/sobre$/);
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgb(250, 250, 245)");
    await expect(page.locator("#whatsapp-flutuante")).toBeVisible();
    await page.getByRole("banner").getByRole("link", { name: "Ipê Solar" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#hero-hora")).toHaveText("05:40");
    await expect(page.locator("#topo")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("no celular em pé, a câmera foca a casa", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await expect(page.locator("#hero-perto")).toHaveAttribute("viewBox", "780 300 750 600");
    const casa = (await page.locator("#hero-casa").boundingBox())!;
    expect(casa.x).toBeGreaterThanOrEqual(0);
    expect(casa.x + casa.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  });

  test("no celular deitado, a cena inteira fica ancorada à direita, com a casa na tela", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.setViewportSize({ width: 812, height: 375 });
    await page.goto("/");
    await expect(page.locator("#hero-perto")).toHaveAttribute("viewBox", "0 0 1600 900");
    const casa = (await page.locator("#hero-casa").boundingBox())!;
    expect(casa.x).toBeGreaterThanOrEqual(0);
    expect(casa.x + casa.width).toBeLessThanOrEqual(812);
  });
});

test.describe("hero com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("uma tela, com o meio-dia parado", async ({ page }) => {
    await page.goto("/");
    const caixa = (await page.locator("#hero").boundingBox())!;
    expect(caixa.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
    await expect(page.locator("#hero-hora")).toHaveText("12:00");
    await expect(page.locator(".hero__faixa--final")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero__faixa--1")).toHaveCSS("opacity", "0");
  });
});

test("trocar o movimento reduzido no meio da visita muda o hero na hora", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero-hora")).toHaveText("05:40");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#hero-hora")).toHaveText("12:00");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#hero-hora")).toHaveText("05:40");
});
