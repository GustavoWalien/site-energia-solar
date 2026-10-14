import { afterEach, describe, expect, it, vi } from "vitest";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { destinoDoPedido, escolherTransporte, montarEmail, transporteTeste } from "@/lib/email";

const pedido = {
  nome: "Ana Souza",
  whatsapp: "65999998888",
  cidade: "",
  conta: "R$ 300 a R$ 600",
  onde: "Casa",
  mensagem: "Telhado de cerâmica.",
};

describe("e-mail do pedido", () => {
  afterEach(() => vi.restoreAllMocks());

  it("assunto com nome e lugar, e o corpo com todos os campos e o endereço do site", () => {
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://ipe-solar.vercel.app");
    expect(email.assunto).toBe("Pedido de orçamento: Ana Souza (Casa)");
    expect(email.para).toBe("a@exemplo.com");
    expect(email.texto).toContain("WhatsApp: 65999998888");
    expect(email.texto).toContain("Cidade e bairro: não informado");
    expect(email.texto).toContain("Valor médio da conta: R$ 300 a R$ 600");
    expect(email.texto).toContain("Mensagem: Telhado de cerâmica.");
    expect(email.texto).toContain("https://ipe-solar.vercel.app");
  });

  it("no modo conceito, vai para o autor pelo remetente de teste do Resend", () => {
    expect(destinoDoPedido(config, empresa)).toEqual({ para: "gustavowalien@gmail.com", de: "onboarding@resend.dev" });
  });

  it("fora do modo conceito, vai para a empresa pelo remetente dela", () => {
    const real = { ...empresa, emailPedidos: "pedidos@exemplo.com.br", remetente: "site@exemplo.com.br" };
    expect(destinoDoPedido({ ...config, modoConceito: false }, real)).toEqual({
      para: "pedidos@exemplo.com.br",
      de: "site@exemplo.com.br",
    });
  });

  it("o transporte de teste não sai para a rede e simula falha com “Teste Falha”", async () => {
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await transporteTeste(email)).toEqual({ ok: true });
    expect(await transporteTeste({ ...email, assunto: "Pedido de orçamento: Teste Falha (Casa)" })).toEqual({
      ok: false,
    });
  });

  it("sem EMAIL_TRANSPORTE, até o Plano 5, o envio falha e o log não leva dado do pedido", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const enviar = escolherTransporte({});
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await enviar(email)).toEqual({ ok: false });
    expect(log).toHaveBeenCalledOnce();
    expect(JSON.stringify(log.mock.calls)).not.toContain("Ana");
    expect(escolherTransporte({ EMAIL_TRANSPORTE: "teste" })).toBe(transporteTeste);
  });
});
