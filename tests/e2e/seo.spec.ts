import { expect, test } from "@playwright/test";

test("Início: imagem de compartilhamento da raiz e ícone da Apple", async ({ page, request }) => {
  await page.goto("/");
  const imagem = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(new URL(imagem!).pathname).toBe("/opengraph-image.png");
  const resposta = await request.get("/opengraph-image.png");
  expect(resposta.status()).toBe(200);
  expect(resposta.headers()["content-type"]).toBe("image/png");
  const icone = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(icone!)).status()).toBe(200);
});
