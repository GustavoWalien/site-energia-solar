import { expect, test } from "@playwright/test";

test.describe("Sobre", () => {
  test("história, números, equipe com retratos e cidades atendidas", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page).toHaveTitle("Sobre a Ipê Solar | Energia solar em Cuiabá");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gente de Cuiabá cuidando do seu telhado.");
    await expect(page.locator(".cabecalho")).toContainText("numa garagem no Coxipó");
    await expect(page.locator("#numeros li")).toHaveCount(3);
    await expect(page.locator("#numeros")).toContainText("1.200");
    const equipe = page.locator("#equipe");
    await expect(equipe.getByRole("heading", { level: 3 })).toHaveText([
      "Marina Duarte",
      "Paulo Arruda",
      "Luana Campos",
      "Tião Moraes",
    ]);
    await expect(equipe.locator("svg.membro__retrato")).toHaveCount(4);
    for (const svg of await equipe.locator("svg.membro__retrato").all()) {
      await expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.locator("#onde-atendemos li")).toHaveCount(9);
    await expect(page.locator("#orcamento form")).toHaveCount(1);
  });
});
