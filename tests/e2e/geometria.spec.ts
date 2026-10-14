import { expect, test, type Page } from "@playwright/test";

/** Troca o nome da placa no DOM, para simular o modelo com o nome mais longo permitido (18 caracteres). */
async function nomeLongo(page: Page, nome: string) {
  await page.locator(".topo__placa").evaluate((placa, texto) => {
    placa.lastChild!.textContent = texto;
  }, nome);
}

test.describe("geometria", () => {
  test.skip(({ isMobile }) => isMobile, "as larguras são definidas em cada teste");

  for (const [largura, altura] of [
    [1024, 768],
    [1180, 820],
    [1280, 800],
  ]) {
    test(`em ${largura} px, o botão flutuante não cobre o "Ver portfólio"`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: altura });
      await page.goto("/sobre");
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const link = page.getByRole("contentinfo").getByRole("link", { name: "Ver portfólio" });
      const coberto = await link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const pontos = [
          [r.left + 2, r.top + r.height / 2],
          [r.left + r.width / 2, r.top + r.height / 2],
          [r.right - 2, r.top + r.height / 2],
        ];
        return pontos.some(([x, y]) => !el.contains(document.elementFromPoint(x, y)));
      });
      expect(coberto).toBe(false);
    });
  }

  for (const [largura, nome] of [
    [360, "Mundo Novo Energia"],
    [360, "Energia do Cerrado"],
    [320, "Energia do Cerrado"],
  ] as const) {
    test(`em ${largura} px, "${nome}" deixa os ícones inteiros e dentro da tela`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 740 });
      await page.goto("/sobre");
      await nomeLongo(page, nome);
      const medidas = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>(".topo .topo__icone")].map((el) => {
          const r = el.getBoundingClientRect();
          return { largura: r.width, altura: r.height, direita: r.right };
        }),
      );
      expect(medidas).toHaveLength(2);
      for (const m of medidas) {
        expect(m.largura).toBeGreaterThanOrEqual(44);
        expect(m.altura).toBeGreaterThanOrEqual(44);
        expect(m.direita).toBeLessThanOrEqual(largura);
      }
      if (largura >= 360) {
        // em 360 px o nome inteiro ainda cabe, sem reticências
        const cortado = await page
          .locator(".topo__placa")
          .evaluate((placa) => {
            const nome = placa.lastElementChild as HTMLElement | null;
            return !nome || nome.tagName === "svg" || nome.scrollWidth > nome.clientWidth;
          });
        expect(cortado).toBe(false);
      }
    });
  }

  test("o foco do botão flutuante aparece também sobre o rodapé azul", async ({ page }) => {
    await page.goto("/sobre");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.keyboard.press("Tab");
    await page.locator("#whatsapp-flutuante").focus();
    const foco = await page.locator("#whatsapp-flutuante").evaluate((el) => {
      const s = getComputedStyle(el);
      return { contorno: `${s.outlineStyle} ${s.outlineColor}`, sombra: s.boxShadow };
    });
    // anel claro (papel) colado no botão, que aparece no azul, e contorno azul por fora, que aparece no claro
    expect(foco.sombra).toContain("rgb(250, 250, 245)");
    expect(foco.contorno).toBe("solid rgb(14, 53, 87)");
  });
});
