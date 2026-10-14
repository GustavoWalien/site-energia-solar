import { expect, test } from "@playwright/test";

// Roda sozinho, depois dos outros testes (projeto "desempenho" no playwright.config.ts): a medida de quadros não
// pode disputar o processador com a bateria em paralelo. Aqui não há GPU, e até o protótipo aprovado perde um quadro
// (33 ms) em 2% a 3% das vezes; por isso o teste vigia a regressão de verdade, que são dois ou mais quadros
// perdidos (> 50 ms), e põe um alarme relativo acima de 33 ms: sozinho o port mede de 0,9% a 1,9%, e depois da
// bateria inteira chegou a 6,6%; 10% avisa uma deriva que dobre o pior valor sem disparar à toa.
// A meta da spec (no máximo 2% acima de 33 ms) é conferida no aparelho de verdade, no Plano 5 (spec, seção 13).
test("rolar o hero não engasga: no máximo 2% acima de 50 ms e 10% acima de 33 ms", async ({ page }) => {
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
  const acima33 = quadros.filter((d) => d > 33).length / quadros.length;
  const acima50 = quadros.filter((d) => d > 50).length / quadros.length;
  test.info().annotations.push({
    type: "quadros",
    description: `acima de 33 ms: ${(acima33 * 100).toFixed(1)}%; acima de 50 ms: ${(acima50 * 100).toFixed(1)}%`,
  });
  expect(acima50).toBeLessThanOrEqual(0.02);
  expect(acima33).toBeLessThanOrEqual(0.1);
});
