import { afterEach, describe, expect, it, vi } from "vitest";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import {
  destinoDoPedido,
  escolherTransporte,
  LIMITE_ENVIO_MS,
  montarEmail,
  transporteIndisponivel,
  transporteResend,
  transporteTeste,
  type ClienteResend,
} from "@/lib/email";

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

  it("no modo conceito, vai para o autor pelo remetente do domínio verificado do autor", () => {
    expect(destinoDoPedido(config, empresa)).toEqual({
      para: "gustavowalien@gmail.com",
      de: "Ipê Solar (projeto conceito) <site@gustavowalien.com>",
    });
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

  it("sem chave do Resend, o envio falha e o log não leva dado do pedido", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const enviar = escolherTransporte({});
    expect(enviar).toBe(transporteIndisponivel);
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await enviar(email)).toEqual({ ok: false });
    expect(log).toHaveBeenCalledOnce();
    expect(JSON.stringify(log.mock.calls)).not.toContain("Ana");
  });

  it("EMAIL_TRANSPORTE=teste vence a chave do Resend: os testes nunca enviam e-mail", () => {
    expect(escolherTransporte({ EMAIL_TRANSPORTE: "teste", RESEND_API_KEY: "re_teste" })).toBe(transporteTeste);
  });

  it("com a chave do Resend, o envio vai pelo Resend, com o cliente criado com essa chave", async () => {
    const chaves: string[] = [];
    const { cliente, enviados } = clienteFalso(async () => ({ error: null }));
    const enviar = escolherTransporte({ RESEND_API_KEY: "re_teste" }, (chave) => {
      chaves.push(chave);
      return cliente;
    });
    const email = montarEmail(pedido, { para: "a@exemplo.com", de: "b@exemplo.com" }, "https://x");
    expect(await enviar(email)).toEqual({ ok: true });
    expect(chaves).toEqual(["re_teste"]);
    expect(enviados).toHaveLength(1);
  });
});

/** Um cliente do Resend sem rede: guarda o que recebeu e responde como mandarem. */
function clienteFalso(resposta: () => Promise<{ error: { name?: string; message?: string } | null }>) {
  const enviados: unknown[] = [];
  const cliente: ClienteResend = {
    emails: {
      send: async (dados) => {
        enviados.push(dados);
        return resposta();
      },
    },
  };
  return { cliente, enviados };
}

describe("transporte do Resend", () => {
  afterEach(() => vi.restoreAllMocks());
  const email = montarEmail(pedido, { para: "autor@exemplo.com", de: "Site <site@exemplo.com>" }, "https://x");

  it("manda remetente, destino, assunto e texto do pedido", async () => {
    const { cliente, enviados } = clienteFalso(async () => ({ error: null }));
    expect(await transporteResend(cliente)(email)).toEqual({ ok: true });
    expect(enviados).toEqual([
      { from: "Site <site@exemplo.com>", to: ["autor@exemplo.com"], subject: email.assunto, text: email.texto },
    ]);
  });

  it("erro do Resend: falha, e o log leva só o tipo do erro, sem o endereço nem o pedido", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { cliente } = clienteFalso(async () => ({
      error: { name: "validation_error", message: "You can only send testing emails to autor@exemplo.com" },
    }));
    expect(await transporteResend(cliente)(email)).toEqual({ ok: false });
    const registro = JSON.stringify(log.mock.calls);
    expect(registro).toContain("validation_error");
    expect(registro).not.toContain("autor@exemplo.com");
    expect(registro).not.toContain("Ana");
  });

  it("Resend travado (sem resposta): desiste no tempo limite e falha, sem dado no log", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { cliente } = clienteFalso(() => new Promise(() => {}));
    const inicio = Date.now();
    expect(await transporteResend(cliente, 50)(email)).toEqual({ ok: false });
    expect(Date.now() - inicio).toBeLessThan(2000);
    expect(log).toHaveBeenCalledOnce();
    expect(JSON.stringify(log.mock.calls)).not.toContain("autor@exemplo.com");
  });

  it("o tempo limite padrão do envio é de 10 segundos", () => {
    expect(LIMITE_ENVIO_MS).toBe(10_000);
  });

  it("Resend fora do ar (exceção de rede): falha sem derrubar a ação e sem dado no log", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { cliente } = clienteFalso(async () => {
      throw new Error("fetch failed para autor@exemplo.com");
    });
    expect(await transporteResend(cliente)(email)).toEqual({ ok: false });
    expect(log).toHaveBeenCalledOnce();
    expect(JSON.stringify(log.mock.calls)).not.toContain("autor@exemplo.com");
  });
});
