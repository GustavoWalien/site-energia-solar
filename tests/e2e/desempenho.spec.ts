import { expect, test } from "@playwright/test";

// Roda sozinho, depois dos outros testes (projeto "desempenho" no playwright.config.ts): a medida de quadros não
// pode disputar o processador com a bateria em paralelo. Aqui não há GPU, e até o protótipo aprovado perde um quadro
// (33 ms) em 2% a 3% das vezes; por isso o teste vigia a regressão de verdade, que são dois ou mais quadros
// perdidos (> 50 ms). A meta da spec (no máximo 2% acima de 33 ms) é conferida no aparelho de verdade, no Plano 5.
test("rolar o hero não engasga: no máximo 2% de quadros com mais de 50 ms", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const quadros: number[] = [];
    (window as unknown as { quadros: number[] }).quadros = quadros;
    let antes = performance.now();
    const medir = (agora: number) => {
      quadros.push(agora - antes);
      antes = agora;
      requestAnimationFrame(medir);
    };
    requestAnimationFrame(medir);
  });
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);
  const quadros = await page.evaluate(() => (window as unknown as { quadros: number[] }).quadros.slice(5));
  const lentos = quadros.filter((d) => d > 50).length;
  expect(lentos / quadros.length).toBeLessThanOrEqual(0.02);
});
