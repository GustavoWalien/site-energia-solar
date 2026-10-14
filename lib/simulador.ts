import type { ConstantesSimulador } from "@/content/tipos";

export type Estimativa = {
  placas: number;
  kwp: number;
  /** Faixa de economia por mês, em reais inteiros: [menor, maior]. */
  economiaMes: [number, number];
  economiaAno: [number, number];
};

/** A conta da spec (seção 7), a partir do valor da conta de luz em reais por mês. */
export function estimar(conta: number, c: ConstantesSimulador): Estimativa {
  const consumo = conta / c.tarifa;
  const compensavel = Math.max(0, consumo - c.taxaMinimaKwh);
  const placas = Math.max(1, Math.ceil(((compensavel / (c.geracaoKwhPorKwpDia * 30)) * 1000) / c.potenciaPlacaW));
  const kwp = (placas * c.potenciaPlacaW) / 1000;
  const economia = compensavel * c.tarifa * (1 - c.perdaFioB);
  const economiaMes: [number, number] = [
    Math.round(economia * (1 - c.margem)),
    Math.round(economia * (1 + c.margem)),
  ];
  return { placas, kwp, economiaMes, economiaAno: [economiaMes[0] * 12, economiaMes[1] * 12] };
}

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

/** "1.200" */
export const milhar = (valor: number) => inteiro.format(valor);
/** "R$ 1.200", sem centavos. */
export const reais = (valor: number) => `R$ ${milhar(valor)}`;
/** "2,9" */
export const decimal = (valor: number) => umaCasa.format(valor);
