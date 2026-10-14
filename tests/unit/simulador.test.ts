import { describe, expect, it } from "vitest";
import { constantesSimulador as c } from "@/content/simulador";
import { decimal, estimar, milhar, reais } from "@/lib/simulador";
import { preencher } from "@/lib/texto";

describe("estimar", () => {
  it("R$ 450 dá 5 placas, 2,9 kWp e R$ 310 a R$ 357 por mês (referência da spec)", () => {
    const e = estimar(450, c);
    expect(e.placas).toBe(5);
    expect(decimal(e.kwp)).toBe("2,9");
    expect(e.economiaMes).toEqual([310, 357]);
    expect(e.economiaAno).toEqual([3720, 4284]);
  });

  it("R$ 1.200 dá 14 placas e R$ 903 a R$ 1.039 por mês (referência da spec)", () => {
    const e = estimar(1200, c);
    expect(e.placas).toBe(14);
    expect(decimal(e.kwp)).toBe("8,2");
    expect(e.economiaMes).toEqual([903, 1039]);
  });

  it("nos limites do deslizador: R$ 150 e R$ 3.000", () => {
    expect(estimar(150, c)).toEqual({ placas: 2, kwp: 1.17, economiaMes: [73, 84], economiaAno: [876, 1008] });
    const alto = estimar(3000, c);
    expect(alto.placas).toBe(34);
    expect(alto.economiaMes).toEqual([2326, 2676]);
  });

  it("conta abaixo da taxa mínima: uma placa e economia zero", () => {
    expect(estimar(40, c)).toEqual({ placas: 1, kwp: 0.585, economiaMes: [0, 0], economiaAno: [0, 0] });
  });

  it("quanto maior a conta, mais placas e mais economia", () => {
    let anterior = estimar(c.minimo, c);
    for (let conta = c.minimo + c.passo; conta <= c.maximo; conta += c.passo) {
      const atual = estimar(conta, c);
      expect(atual.placas).toBeGreaterThanOrEqual(anterior.placas);
      expect(atual.economiaMes[0]).toBeGreaterThanOrEqual(anterior.economiaMes[0]);
      anterior = atual;
    }
  });
});

describe("formatos", () => {
  it("reais sem centavos e com ponto de milhar", () => {
    expect(milhar(1200)).toBe("1.200");
    expect(reais(1039)).toBe("R$ 1.039");
    expect(reais(310)).toBe("R$ 310");
  });

  it("uma casa decimal com vírgula", () => {
    expect(decimal(2.925)).toBe("2,9");
    expect(decimal(19.89)).toBe("19,9");
  });

  it("preencher troca as chaves e deixa as desconhecidas", () => {
    expect(preencher("R$ {valor}, {nome}!", { valor: "450" })).toBe("R$ 450, {nome}!");
  });
});
