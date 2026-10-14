import { describe, expect, it } from "vitest";
import {
  ARCOS,
  ESTRELAS,
  PETALAS,
  PLACAS,
  RAIOS,
  amostrarArco,
  dDoArco,
  dividirEmPalavras,
  marcasDeHora,
  montagemDaFaixa,
  opacidadeDaFaixa,
  relogio,
  solNoCaminho,
  suave,
  tDosMinutos,
  textoCorrido,
} from "@/components/hero/geometria";

describe("geometria do hero", () => {
  it("suave vai de 0 a 1 entre a e b", () => {
    expect(suave(0, 0.2, 0.4)).toBe(0);
    expect(suave(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(suave(1, 0.2, 0.4)).toBe(1);
  });

  it("o relógio vai de 05:40 a 12:00, com 06:00 quando o sol aparece", () => {
    expect(relogio(0)).toBe("05:40");
    expect(relogio(0.2)).toBe("06:00");
    expect(relogio(1)).toBe("12:00");
    expect(tDosMinutos(720)).toBe(1);
  });

  it("o sol sai do começo do caminho e chega ao fim antes do último pedaço do scroll", () => {
    expect(solNoCaminho(0)).toBe(0);
    expect(solNoCaminho(0.94)).toBe(1);
    expect(solNoCaminho(1)).toBe(1);
    expect(solNoCaminho(0.3)).toBeGreaterThan(solNoCaminho(0.2));
  });

  it("o caminho vira uma curva quadrática", () => {
    expect(dDoArco(ARCOS.paisagem)).toBe("M1530 780 Q1440 170 1150 225");
  });

  it("os pontos do caminho começam e terminam nas pontas e são igualmente espaçados", () => {
    const pontos = amostrarArco(ARCOS.paisagem);
    expect(pontos).toHaveLength(241);
    expect(pontos[0]![0]).toBeCloseTo(1530);
    expect(pontos[0]![1]).toBeCloseTo(780);
    expect(pontos[240]![0]).toBeCloseTo(1150);
    expect(pontos[240]![1]).toBeCloseTo(225);
    const passos = pontos.slice(1).map((p, i) => Math.hypot(p[0] - pontos[i]![0], p[1] - pontos[i]![1]));
    expect(Math.max(...passos) / Math.min(...passos)).toBeLessThan(1.02);
  });

  it("as marcas de hora ficam a 70 unidades do caminho", () => {
    const pontos = amostrarArco(ARCOS.paisagem);
    const marcas = marcasDeHora(pontos);
    expect(marcas.map((m) => m.texto)).toEqual(["07:00", "09:00"]);
    for (const m of marcas) {
      const perto = Math.min(...pontos.map(([x, y]) => Math.hypot(x - m.x, y - m.y)));
      expect(perto).toBeGreaterThan(66);
      expect(perto).toBeLessThan(71);
    }
  });

  it("cada faixa de texto aparece só no seu trecho", () => {
    expect(opacidadeDaFaixa(0, 0)).toBe(1);
    expect(opacidadeDaFaixa(0.3, 0)).toBe(0);
    expect(opacidadeDaFaixa(0.3, 1)).toBe(0);
    expect(opacidadeDaFaixa(0.5, 1)).toBe(1);
    expect(opacidadeDaFaixa(0.7, 1)).toBe(0);
    expect(opacidadeDaFaixa(0.6, 2)).toBe(0);
    expect(opacidadeDaFaixa(1, 2)).toBe(1);
  });

  it("a montagem das palavras vai de 0 a 1 no começo da faixa; a primeira já vem montada", () => {
    expect(montagemDaFaixa(0, 0)).toBe(1);
    expect(montagemDaFaixa(0.36, 1)).toBe(0);
    expect(montagemDaFaixa(0.5, 1)).toBe(1);
  });

  it("oito placas com ordens de 0 a 7, doze raios, oito estrelas e doze pétalas", () => {
    expect(PLACAS.map((p) => p.ordem).sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(PLACAS.map((p) => p.id)).size).toBe(8);
    for (const p of PLACAS) expect(p.quad.split(" ")).toHaveLength(4);
    expect(RAIOS).toHaveLength(12);
    expect(ESTRELAS).toHaveLength(8);
    expect(PETALAS).toHaveLength(12);
  });

  it("divide o título em palavras sem perder o destaque e com a pontuação colada", () => {
    const titulo = [{ texto: "Em Cuiabá, o sol " }, { texto: "chega cedo", destaque: true }, { texto: "." }];
    const palavras = dividirEmPalavras(titulo);
    expect(palavras).toHaveLength(6);
    expect(palavras[4]).toEqual({ i: 4, partes: [{ texto: "chega", destaque: true }] });
    expect(palavras[5]).toEqual({ i: 5, partes: [{ texto: "cedo", destaque: true }, { texto: "." }] });
    expect(textoCorrido(titulo)).toBe("Em Cuiabá, o sol chega cedo.");
  });
});
