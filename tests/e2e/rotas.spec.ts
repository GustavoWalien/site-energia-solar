import { expect, test } from "@playwright/test";

const ROTAS = [
  "/",
  "/servicos",
  "/servicos/energia-solar-residencial",
  "/servicos/energia-solar-para-empresas",
  "/servicos/energia-solar-rural",
  "/servicos/limpeza-de-placas-solares",
  "/sobre",
  "/contato",
];

test.describe("todas as páginas", () => {
  for (const rota of ROTAS) {
    test(`${rota}: um H1, título e descrição no tamanho, sem erros e nada saindo pela direita`, async ({ page }) => {
      const erros: string[] = [];
      page.on("pageerror", (e) => erros.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") erros.push(m.text());
      });
      await page.route("https://www.google.com/**", (r) =>
        r.fulfill({ contentType: "text/html", body: "<!doctype html><title>mapa</title>" }),
      );
      await page.goto(rota);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const titulo = await page.title();
      expect(titulo).toContain("Ipê Solar");
      expect(titulo.length).toBeLessThanOrEqual(60);
      const descricao = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(descricao.length).toBeGreaterThanOrEqual(50);
      expect(descricao.length).toBeLessThanOrEqual(160);
      const vazados = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => !el.closest("#hero-palco"))
          .filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > window.innerWidth + 0.5)
          .map((el) => el.tagName),
      );
      expect(vazados).toEqual([]);
      expect(erros).toEqual([]);
    });
  }
});

test("endereço que não existe: 404 com a página que tomou sombra", async ({ page }) => {
  for (const rota of ["/nao-existe", "/servicos/nao-existe"]) {
    const resposta = await page.goto(rota);
    expect(resposta!.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Essa página tomou sombra.");
    await expect(page.getByRole("main").getByRole("link", { name: "Voltar para a Início" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page).toHaveTitle("Página não encontrada | Ipê Solar");
  }
});
