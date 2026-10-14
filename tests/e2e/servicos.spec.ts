import { expect, test } from "@playwright/test";

const PAGINAS = [
  ["energia-solar-residencial", "Energia solar para casa em Cuiabá", "Energia solar residencial em Cuiabá | Ipê Solar", 6, "Faz mais sentido se"],
  ["energia-solar-para-empresas", "Energia solar para empresas em Cuiabá", "Energia solar para empresas em Cuiabá | Ipê Solar", 4, "Para quem"],
  ["energia-solar-rural", "Energia solar para fazenda e sítio", "Energia solar rural em Mato Grosso | Ipê Solar", 4, "Usos"],
  ["limpeza-de-placas-solares", "Limpeza e manutenção de placas solares em Cuiabá", "Limpeza de placas solares em Cuiabá | Ipê Solar", 4, "Planos"],
] as const;

test.describe("serviços", () => {
  test("a lista mostra os quatro serviços com link para cada página", async ({ page }) => {
    await page.goto("/servicos");
    await expect(page).toHaveTitle("Serviços de energia solar em Cuiabá | Ipê Solar");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Escolha o serviço que cabe no seu telhado.");
    const lista = page.locator("main .fazemos__lista");
    await expect(lista.getByRole("heading", { level: 2 })).toHaveCount(4);
    await expect(lista.getByRole("link", { name: "Energia solar rural" })).toHaveAttribute(
      "href",
      "/servicos/energia-solar-rural",
    );
  });

  for (const [slug, h1, titulo, incluidos, extra] of PAGINAS) {
    test(`/servicos/${slug}: título, H1, trilha, listas, perguntas e orçamento`, async ({ page }) => {
      await page.goto(`/servicos/${slug}`);
      await expect(page).toHaveTitle(titulo);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      const trilha = page.getByRole("navigation", { name: "Trilha" });
      await expect(trilha.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
      await expect(trilha.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/servicos");
      await expect(page.locator("#incluido li")).toHaveCount(incluidos);
      await expect(page.locator("#extra").getByRole("heading", { level: 2 })).toHaveText(extra);
      await expect(page.locator("#perguntas details")).toHaveCount(2);
      const orcamento = page.locator(".cabecalho").getByRole("link", { name: "Peça seu orçamento" });
      await expect(orcamento).toHaveAttribute("data-aviso", "");
      await expect(page.locator("#orcamento form")).toHaveCount(1);
    });
  }
});

test.describe("serviços sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a página de um serviço vem inteira no HTML, com o H1 e o formulário", async ({ page }) => {
    await page.goto("/servicos/energia-solar-rural");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Energia solar para fazenda e sítio");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#orcamento form")).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });
});
