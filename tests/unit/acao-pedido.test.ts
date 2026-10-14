import { beforeAll, describe, expect, it } from "vitest";
import { enviarPedido, type EstadoPedido } from "@/app/actions/pedido";

const INICIAL: EstadoPedido = { status: "inicial" };

function dados(campos: Record<string, string>) {
  const fd = new FormData();
  for (const [chave, valor] of Object.entries(campos)) fd.set(chave, valor);
  return fd;
}

const valido = {
  nome: "Ana Souza",
  whatsapp: "(65) 99999-8888",
  cidade: "",
  conta: "Até R$ 300",
  onde: "Casa",
  mensagem: "",
  site: "",
  inicio: String(Date.now() - 10_000),
};

describe("enviarPedido", () => {
  beforeAll(() => {
    process.env.EMAIL_TRANSPORTE = "teste";
  });

  it("pedido válido é enviado", async () => {
    expect(await enviarPedido(INICIAL, dados(valido))).toEqual({ status: "enviado", nome: "Ana Souza" });
  });

  it("campos inválidos voltam com os erros e com os valores para preencher de novo", async () => {
    const estado = await enviarPedido(INICIAL, dados({ ...valido, nome: "", whatsapp: "123" }));
    expect(estado.status).toBe("invalido");
    if (estado.status !== "invalido") return;
    expect(Object.keys(estado.erros).sort()).toEqual(["nome", "whatsapp"]);
    expect(estado.valores.whatsapp).toBe("123");
    expect(estado.valores).not.toHaveProperty("site");
  });

  it("falha no envio volta como falha, com os valores", async () => {
    const estado = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha" }));
    expect(estado).toMatchObject({ status: "falha", valores: { nome: "Teste Falha" } });
  });

  it("robô recebe sucesso falso, sem envio (com “Teste Falha”, o envio daria falha)", async () => {
    const armadilha = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha", site: "spam" }));
    expect(armadilha.status).toBe("enviado");
    const rapido = await enviarPedido(INICIAL, dados({ ...valido, nome: "Teste Falha", inicio: String(Date.now()) }));
    expect(rapido.status).toBe("enviado");
  });
});
