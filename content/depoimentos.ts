import type { Depoimento } from "./tipos";

/** Depoimentos ilustrativos: no modo conceito, a nota avisa que são fictícios. */
export const depoimentos: Depoimento[] = [
  {
    texto: "No verão, a conta passava de R$ 900 com os dois ar-condicionados. Hoje fica abaixo de R$ 200.",
    nome: "Fernanda",
    lugar: "Jardim Itália",
    tipo: "casa",
  },
  {
    texto: "Mostraram foto do telhado antes e depois, telha por telha. Choveu muito em janeiro e nenhuma goteira.",
    nome: "Benedito",
    lugar: "Coxipó",
    tipo: "casa",
  },
  {
    texto: "A parcela do financiamento rural ficou menor que a economia na conta do sítio.",
    nome: "Rogério",
    lugar: "Santo Antônio de Leverger",
    tipo: "sítio",
  },
];
