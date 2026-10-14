import { describe, expect, it } from "vitest";
import { depoimentos } from "@/content/depoimentos";
import { formulario } from "@/content/formulario";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";
import { servicos } from "@/content/servicos";
import { constantesSimulador as c } from "@/content/simulador";

describe("conteúdo da Início", () => {
  it("o hero tem três faixas, e cada título tem um trecho em destaque", () => {
    expect(inicio.hero.faixas).toHaveLength(3);
    for (const faixa of inicio.hero.faixas) {
      expect(faixa.titulo.filter((t) => t.destaque)).toHaveLength(1);
    }
    expect(inicio.hero.faixas[0].rotulo).toBe("Energia solar em Cuiabá");
  });

  it("os quatro serviços têm os endereços da spec e ícones diferentes", () => {
    expect(servicos.map((s) => s.slug)).toEqual([
      "energia-solar-residencial",
      "energia-solar-para-empresas",
      "energia-solar-rural",
      "limpeza-de-placas-solares",
    ]);
    expect(new Set(servicos.map((s) => s.icone)).size).toBe(4);
  });

  it("quatro passos, quatro promessas com ícones diferentes, três depoimentos e oito perguntas", () => {
    expect(inicio.comoFunciona.passos).toHaveLength(4);
    expect(inicio.promessas.itens).toHaveLength(4);
    expect(new Set(inicio.promessas.itens.map((p) => p.icone)).size).toBe(4);
    expect(depoimentos).toHaveLength(3);
    expect(perguntas).toHaveLength(8);
    expect(new Set(perguntas.map((p) => p.pergunta)).size).toBe(8);
  });

  it("o deslizador começa dentro da faixa e num múltiplo do passo", () => {
    expect(c.minimo).toBe(150);
    expect(c.maximo).toBe(3000);
    expect(c.inicial).toBeGreaterThanOrEqual(c.minimo);
    expect(c.inicial).toBeLessThanOrEqual(c.maximo);
    expect((c.inicial - c.minimo) % c.passo).toBe(0);
  });

  it("a explicação do simulador cita os números que a conta usa", () => {
    const texto = inicio.simulador.comoTexto.join(" ");
    const br = (n: number, casas = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas });
    for (const trecho of [
      `R$ ${br(c.tarifa, 2)}`,
      `${c.taxaMinimaKwh} kWh`,
      `${c.potenciaPlacaW} W`,
      `${br(c.geracaoKwhPorKwpDia)} kWh por kWp`,
      `${Math.round(c.perdaFioB * 100)}%`,
      `${Math.round(c.margem * 100)}%`,
    ]) {
      expect(texto).toContain(trecho);
    }
  });

  it("os modelos de mensagem têm onde pôr o valor e o nome", () => {
    expect(inicio.simulador.mensagem).toContain("{valor}");
    expect(formulario.sucesso).toContain("{nome}");
    expect(formulario.sucessoConceito).toContain("{nome}");
  });

  it("o formulário tem as opções da spec", () => {
    expect(formulario.opcoesConta).toEqual(["Até R$ 300", "R$ 300 a R$ 600", "R$ 600 a R$ 1.000", "Mais de R$ 1.000"]);
    expect(formulario.opcoesOnde).toEqual(["Casa", "Empresa", "Fazenda ou sítio"]);
  });
});
