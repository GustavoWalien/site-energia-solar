import { expect, test } from "@playwright/test";

test.describe("barra do topo", () => {
  test("a placa mostra o nome, leva à Início e não quebra linha", async ({ page }) => {
    await page.goto("/");
    const placa = page.getByRole("banner").getByRole("link", { name: "Ipê Solar" });
    await expect(placa).toBeVisible();
    await expect(placa).toHaveAttribute("href", "/");
    // altura de layout: a caixa girada durante o balanço seria maior que a placa
    expect(await placa.evaluate((el) => (el as HTMLElement).offsetHeight)).toBeLessThan(70);
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sobra).toBeLessThanOrEqual(0);
  });

  test("no computador: links e chamada para o WhatsApp do autor", async ({ page, isMobile }) => {
    test.skip(isMobile, "só no computador");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const rotulo of ["Serviços", "Sobre", "Blog", "Contato"]) {
      await expect(nav.getByRole("link", { name: rotulo })).toBeVisible();
    }
    const chamada = page.getByRole("link", { name: "Peça seu orçamento" });
    await expect(chamada).toHaveAttribute("href", /^https:\/\/wa\.me\/5565981222210\?text=/);
    await expect(chamada).toHaveAttribute("data-aviso", "");
  });

  test("no celular: o menu abre, fecha com Esc e devolve o foco", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeHidden();
    await expect(page.getByRole("banner").getByRole("link", { name: "Peça seu orçamento" })).toBeHidden();
    const botao = page.locator("summary[aria-label='Menu']");
    await botao.click();
    const painel = page.getByRole("navigation", { name: "Menu" });
    const contato = painel.getByRole("link", { name: "Contato" });
    await expect(contato).toBeVisible();
    // o foco sai do summary (como quem navega pelo menu com Tab) antes do Esc
    await contato.focus();
    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();
    await expect(botao).toBeFocused();
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("o menu do celular abre e o WhatsApp tem link real", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/");
    await page.locator("summary[aria-label='Menu']").click();
    await expect(page.getByRole("navigation", { name: "Menu" }).getByRole("link", { name: "Serviços" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Fale no WhatsApp" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/5565981222210/,
    );
  });
});
