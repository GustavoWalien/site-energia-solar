import { describe, expect, it } from "vitest";
import { formulario } from "@/content/formulario";
import { normalizarWhatsapp, pareceRobo, validarPedido } from "@/lib/pedido";

const valido = {
  nome: "Ana Souza",
  whatsapp: "(65) 99999-8888",
  cidade: "Cuiabá, Jardim Itália",
  conta: "R$ 300 a R$ 600",
  onde: "Casa",
  mensagem: "",
};

describe("normalizarWhatsapp", () => {
  it("aceita 10 ou 11 dígitos, com ou sem +55", () => {
    expect(normalizarWhatsapp("(65) 99999-8888")).toBe("65999998888");
    expect(normalizarWhatsapp("+55 65 3322-1100")).toBe("6533221100");
    expect(normalizarWhatsapp("55 65 99999-8888")).toBe("65999998888");
  });

  it("recusa número curto, longo ou vazio", () => {
    expect(normalizarWhatsapp("99999-8888")).toBeNull();
    expect(normalizarWhatsapp("1234567890123456")).toBeNull();
    expect(normalizarWhatsapp("")).toBeNull();
  });
});

describe("validarPedido", () => {
  it("pedido completo passa, com o WhatsApp normalizado e os textos sem espaços nas pontas", () => {
    const r = validarPedido({ ...valido, nome: "  Ana Souza " }, formulario);
    expect(r).toEqual({ ok: true, pedido: { ...valido, whatsapp: "65999998888" } });
  });

  it("campos obrigatórios vazios dão as mensagens da spec", () => {
    const r = validarPedido({}, formulario);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erros).toEqual({
      nome: "Coloque seu nome.",
      whatsapp: "Confira o número do WhatsApp, com DDD.",
      conta: "Escolha o valor médio da conta.",
      onde: "Escolha onde quer instalar.",
    });
  });

  it("limites de tamanho: nome até 80, cidade até 80, mensagem até 1.000", () => {
    const r = validarPedido(
      { ...valido, nome: "a".repeat(81), cidade: "b".repeat(81), mensagem: "c".repeat(1001) },
      formulario,
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.erros).sort()).toEqual(["cidade", "mensagem", "nome"]);
    expect(r.erros.nome).toBe("Use até 80 caracteres no nome.");
  });

  it("nome de uma letra não passa; opção fora da lista não passa", () => {
    const r = validarPedido({ ...valido, nome: "A", conta: "R$ 5 mil", onde: "Lua" }, formulario);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.erros).sort()).toEqual(["conta", "nome", "onde"]);
  });

  it("um arquivo no lugar de um texto conta como vazio", () => {
    const r = validarPedido({ ...valido, nome: new Blob(["x"]) }, formulario);
    expect(r.ok).toBe(false);
  });
});

describe("pareceRobo", () => {
  it("campo armadilha preenchido é robô", () => {
    expect(pareceRobo({ site: "http://spam.example", tempo: "60000" })).toBe(true);
  });

  it("envio com menos de 3 segundos de página é robô; com 3 segundos ou mais, não", () => {
    expect(pareceRobo({ site: "", tempo: "2999" })).toBe(true);
    expect(pareceRobo({ site: "", tempo: "3000" })).toBe(false);
  });

  it("o tempo é medido no navegador, sem comparar relógios: relógio adiantado não vira robô", () => {
    // antes, um carimbo absoluto de um relógio 4 h adiantado contava como "menos de 3 s"
    expect(pareceRobo({ site: "", inicio: String(Date.now() + 4 * 3600_000), tempo: "45000" })).toBe(false);
  });

  it("sem o tempo (sem JavaScript), só a armadilha vale; tempo inválido também", () => {
    expect(pareceRobo({ site: "", tempo: "" })).toBe(false);
    expect(pareceRobo({})).toBe(false);
    expect(pareceRobo({ site: "", tempo: "abc" })).toBe(false);
  });
});
