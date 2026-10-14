import type { Servico } from "./tipos";

/** Os serviços da empresa. A Início mostra os cartões; o Plano 3 acrescenta o conteúdo das páginas. */
export const servicos: Servico[] = [
  {
    slug: "energia-solar-residencial",
    nome: "Energia solar para casa",
    icone: "casa",
    cartao: {
      titulo: "Ar ligado sem medo da conta.",
      texto: "Um sistema do tamanho do seu consumo, com app para ver quanto a casa gera por dia.",
    },
  },
  {
    slug: "energia-solar-para-empresas",
    nome: "Energia solar para empresas",
    icone: "empresa",
    cartao: {
      titulo: "Conta menor, margem maior.",
      texto: "Comércios, clínicas e escritórios gastam energia de dia, justamente quando as placas geram.",
    },
  },
  {
    slug: "energia-solar-rural",
    nome: "Energia solar rural",
    icone: "campo",
    cartao: {
      titulo: "Pivô, bomba e ordenha no sol.",
      texto: "Placas no telhado do galpão ou no chão, com projeto pronto para financiamento rural.",
    },
  },
  {
    slug: "limpeza-de-placas-solares",
    nome: "Limpeza de placas",
    icone: "limpeza",
    cartao: {
      titulo: "Placa suja gera menos.",
      texto: "Na seca, poeira e fuligem das queimadas cobrem as placas. A limpeza devolve a geração.",
    },
  },
];
