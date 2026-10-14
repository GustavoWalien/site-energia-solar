import { expect, test, type Page } from "@playwright/test";

/** Nunca carrega o Google de verdade: o iframe recebe uma página vazia. */
async function semGoogle(page: Page) {
  await page.route("https://www.google.com/**", (rota) =>
    rota.fulfill({ contentType: "text/html", body: "<!doctype html><title>mapa</title>" }),
  );
}

test.describe("Contato", () => {
  test("WhatsApp, horário, local e formulário; sem telefone no modo conceito", async ({ page }) => {
    await semGoogle(page);
    await page.goto("/contato");
    await expect(page).toHaveTitle("Contato | Ipê Solar Cuiabá");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fale com a gente.");
    const blocos = page.locator(".contato__blocos");
    await expect(blocos.getByRole("link", { name: "Chamar no WhatsApp" })).toHaveAttribute("data-aviso", "");
    await expect(blocos).toContainText("Segunda a sexta, das 7h às 17h");
    await expect(blocos).toContainText("Cuiabá-MT · atendimento no local com hora marcada");
    await expect(blocos).not.toContainText("Telefone");
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(page.locator("#orcamento form")).toHaveCount(1);
  });

  test("o mapa só carrega o iframe perto da tela, sem mudar de altura", async ({ page }) => {
    await semGoogle(page);
    await page.setViewportSize({ width: 375, height: 400 });
    await page.goto("/contato");
    const quadro = page.locator(".mapa__quadro");
    // espera o mapa começar a observar a tela: antes disso, "sem iframe" seria verdade por acaso
    await expect(quadro).toHaveAttribute("data-observando", "");
    await page.waitForTimeout(300);
    await expect(quadro.locator("iframe")).toHaveCount(0);
    const antes = (await quadro.boundingBox())!.height;
    await quadro.scrollIntoViewIfNeeded();
    const iframe = quadro.locator("iframe");
    await expect(iframe).toHaveAttribute("title", "Mapa de Cuiabá, MT");
    await expect(iframe).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?q=Cuiab%C3%A1%2C%20MT&z=12&output=embed$/);
    expect((await quadro.boundingBox())!.height).toBeCloseTo(antes, 0);
    await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toBeVisible();
  });
});

test.describe("Contato sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("mapa desenhado com o link alternativo, sem iframe, e o formulário envia", async ({ page }) => {
    await semGoogle(page);
    await page.goto("/contato");
    await expect(page.locator(".mapa__quadro iframe")).toHaveCount(0);
    await expect(page.locator(".mapa__desenho")).toBeVisible();
    await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=Cuiab%C3%A1%2C%20MT",
    );
    const form = page.locator("#orcamento form");
    await form.getByLabel("Nome").fill("Ana");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
    await form.getByRole("radio", { name: "Casa" }).check();
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento")).toContainText("Mensagem recebida, Ana!");
  });
});
