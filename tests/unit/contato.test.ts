import { describe, expect, it } from "vitest";
import type { Autor, Config, Empresa } from "@/content/tipos";
import { destinoWhatsapp } from "@/lib/contato";

const autor: Autor = {
  nome: "Autor",
  whatsapp: "55 65 98122-2210",
  mensagemWhatsapp: "Vi o site conceito",
  email: "autor@exemplo.com",
  portfolio: "https://exemplo.com",
};

const empresa: Empresa = {
  nome: "Empresa",
  frase: "Frase",
  cidade: "Cuiabá",
  estado: "MT",
  seo: { titulo: "Título", descricao: "Descrição" },
  whatsapp: "55 65 3333-4444",
  mensagemWhatsapp: "Quero um orçamento",
  emailPedidos: "pedidos@empresa.com",
  horario: [],
  horarioSchema: [],
  cidades: [],
  numeros: [],
  fundacao: { ano: 2016, bairro: "Centro" },
  mapa: { consulta: "Cuiabá, MT", legenda: "Cuiabá-MT" },
};

describe("destinoWhatsapp", () => {
  it("no modo conceito vai para o autor, com a mensagem dele e com aviso", () => {
    const config: Config = { modoConceito: true, autor };
    expect(destinoWhatsapp(config, empresa, "Mensagem do simulador")).toEqual({
      href: "https://wa.me/5565981222210?text=Vi%20o%20site%20conceito",
      aviso: true,
    });
  });

  it("com o modo desligado vai para a empresa, com a mensagem pedida e sem aviso", () => {
    const config: Config = { modoConceito: false, autor };
    expect(destinoWhatsapp(config, empresa, "Conta de R$ 450")).toEqual({
      href: "https://wa.me/556533334444?text=Conta%20de%20R%24%20450",
      aviso: false,
    });
  });

  it("sem mensagem, usa a mensagem padrão da empresa", () => {
    const config: Config = { modoConceito: false, autor };
    expect(destinoWhatsapp(config, empresa).href).toBe("https://wa.me/556533334444?text=Quero%20um%20or%C3%A7amento");
  });

  it("número da empresa inválido para o build com uma mensagem clara", () => {
    const config: Config = { modoConceito: false, autor };
    expect(() => destinoWhatsapp(config, { ...empresa, whatsapp: "" })).toThrow(/content\/empresa\.ts/);
  });

  it("número do autor inválido para o build com uma mensagem clara", () => {
    const config: Config = { modoConceito: true, autor: { ...autor, whatsapp: "123" } };
    expect(() => destinoWhatsapp(config, empresa)).toThrow(/content\/config\.ts/);
  });
});
