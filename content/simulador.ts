import type { ConstantesSimulador } from "./tipos";

/** Constantes do simulador (spec, seção 7). Para outro cliente, ajuste à distribuidora e à região. */
export const constantesSimulador: ConstantesSimulador = {
  // Estimativa com impostos. A tarifa B1 da Energisa MT é R$ 0,899 sem impostos desde 08/04/2026.
  tarifa: 1.15,
  // Ligação bifásica: a Energisa cobra pelo menos 50 kWh por mês.
  taxaMinimaKwh: 50,
  // Valor conservador para Cuiabá. Confirmar no SunData do CRESESB.
  geracaoKwhPorKwpDia: 4.3,
  potenciaPlacaW: 585,
  // Perda do Fio B em 2026 sobre a energia compensada.
  perdaFioB: 0.15,
  // Margem da faixa de economia, para mais e para menos.
  margem: 0.07,
  // Deslizador: de R$ 150 a R$ 3.000, de 10 em 10, começando em R$ 450.
  minimo: 150,
  maximo: 3000,
  passo: 10,
  inicial: 450,
};
