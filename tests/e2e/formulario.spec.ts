import { expect, test, type Page } from "@playwright/test";

const SUCESSO_CONCEITO =
  "Mensagem recebida, Ana! Como este é um projeto conceito, ela chegou para Gustavo Walien, que fez este site.";

async function formulario(page: Page) {
  await page.goto("/");
  const form = page.locator("#orcamento form");
  await form.scrollIntoViewIfNeeded();
  return form;
}

/** Espera a página completar 3 s: o formulário manda o tempo de página, e menos que isso parece robô. */
async function envelhecer(page: Page) {
  await page.waitForFunction(() => performance.now() > 3100);
}

async function preencher(page: Page, nome: string, whatsapp = "(65) 99999-8888") {
  const form = page.locator("#orcamento form");
  await form.getByLabel("Nome").fill(nome);
  await form.getByLabel("WhatsApp com DDD").fill(whatsapp);
  await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
  await form.getByRole("radio", { name: "Casa" }).check();
}

test.describe("formulário de pedido", () => {
  test("campos vazios mostram os erros, e o foco vai para o nome", async ({ page }) => {
    const form = await formulario(page);
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    const nome = form.getByLabel("Nome");
    await expect(form).toContainText("Coloque seu nome.");
    await expect(form).toContainText("Confira o número do WhatsApp, com DDD.");
    await expect(nome).toHaveAttribute("aria-invalid", "true");
    await expect(nome).toBeFocused();
  });

  test("pedido válido mostra o sucesso da versão conceito", async ({ page }) => {
    const form = await formulario(page);
    await expect(form).toContainText("Formulário de demonstração. A mensagem chega para quem fez este site.");
    await preencher(page, "Ana");
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento").getByRole("status")).toHaveText(SUCESSO_CONCEITO);
  });

  test("falha no envio mostra o alerta e mantém o que foi digitado", async ({ page }) => {
    const form = await formulario(page);
    await preencher(page, "Teste Falha");
    await envelhecer(page);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(form.getByRole("alert")).toHaveText(
      "Não conseguimos enviar agora. Tente de novo ou chame a gente no WhatsApp.",
    );
    await expect(form.getByLabel("Nome")).toHaveValue("Teste Falha");
  });

  test("envio logo que a página abre parece robô: sucesso falso, sem envio", async ({ page }) => {
    const form = await formulario(page);
    await preencher(page, "Teste Falha");
    expect(await page.evaluate(() => performance.now())).toBeLessThan(3000);
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    // "Teste Falha" daria o alerta de falha se o pedido fosse enviado; como robô, vem o sucesso falso
    await expect(page.locator("#orcamento").getByRole("status")).toContainText("Mensagem recebida");
  });

  test("corrigir um erro e reenviar logo em seguida não descarta o pedido como robô", async ({ page }) => {
    const form = await formulario(page);
    await envelhecer(page);
    await preencher(page, "Teste Falha", "123");
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(form).toContainText("Confira o número do WhatsApp, com DDD.");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    // "Teste Falha" só dá falha se o pedido for enviado de verdade; como robô, daria sucesso falso
    await expect(form.getByRole("alert")).toBeVisible();
  });
});

test.describe("formulário sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("envia por POST nativo e mostra o sucesso", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#orcamento form");
    await form.getByLabel("Nome").fill("Ana");
    await form.getByLabel("WhatsApp com DDD").fill("(65) 99999-8888");
    await form.getByLabel("Valor médio da conta").selectOption("R$ 300 a R$ 600");
    await form.getByRole("radio", { name: "Casa" }).check();
    await form.getByRole("button", { name: "Quero meu orçamento" }).click();
    await expect(page.locator("#orcamento")).toContainText(SUCESSO_CONCEITO);
  });
});
