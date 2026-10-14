import { expect, test } from "@playwright/test";

test("página em português, com um H1 na fonte da marca e link de pular", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page).toHaveTitle("Energia solar em Cuiabá | Ipê Solar");

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Bricolage/i);

  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await pular.press("Enter");
  await expect(page.locator("#conteudo")).toBeFocused();

  expect(erros).toEqual([]);
});

test("sem rolagem lateral e nada saindo pela direita da tela", async ({ page }) => {
  await page.goto("/");
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sobra).toBeLessThanOrEqual(0);
  // o body tem overflow-x: clip e a barra é fixa, então o scrollWidth não vê tudo: mede cada elemento visível
  const vazados = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      // a cena do hero passa da borda de propósito e o palco a recorta (overflow: hidden)
      .filter((el) => !el.closest("#hero-palco"))
      .filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > window.innerWidth + 0.5)
      .map((el) => el.tagName + (el.className && typeof el.className === "string" ? "." + el.className : "")),
  );
  expect(vazados).toEqual([]);
});
