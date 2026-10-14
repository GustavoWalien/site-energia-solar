import type { Membro } from "./tipos";

/** A equipe da Sobre, com retratos ilustrados no estilo do hero (sem fotos de pessoas reais). */
export const equipe: Membro[] = [
  {
    nome: "Marina Duarte",
    cargo: "Engenheira eletricista e fundadora",
    texto: "Assina todos os projetos. Gosta de explicar conta de luz até a pessoa entender de verdade.",
    retrato: { pele: "#C98B62", cabelo: "longo", corCabelo: "#2B1D16", roupa: "#3FA2DB" },
  },
  {
    nome: "Paulo Arruda",
    cargo: "Líder de instalação",
    texto: "Doze anos em cima de telhado. Fotografa tudo antes de mexer em uma telha.",
    retrato: { pele: "#8D5A3B", cabelo: "curto", corCabelo: "#1B1410", roupa: "#E2683C", acessorio: "capacete" },
  },
  {
    nome: "Luana Campos",
    cargo: "Projetista",
    texto: "Calcula sombra, inclinação e quantas placas cabem. Não suporta espaço desperdiçado.",
    retrato: { pele: "#E7B48F", cabelo: "coque", corCabelo: "#6B3A1F", roupa: "#1E4D3A", acessorio: "oculos" },
  },
  {
    nome: "Tião Moraes",
    cargo: "Manutenção e limpeza",
    texto: "Conhece o barulho de cada inversor. É quem aparece quando o app avisa que algo parou.",
    retrato: { pele: "#A86B45", cabelo: "curto", corCabelo: "#9AA3AB", roupa: "#3FA2DB", acessorio: "bone" },
  },
];
