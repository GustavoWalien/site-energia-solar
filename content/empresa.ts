import type { Empresa } from "./tipos";

export const empresa: Empresa = {
  nome: "Ipê Solar",
  frase: "Energia solar em Cuiabá e região",
  cidade: "Cuiabá",
  estado: "MT",
  seo: {
    titulo: "Energia solar em Cuiabá",
    descricao:
      "Projeto, instalação e liberação na Energisa para casas, empresas e fazendas em Cuiabá e região. Simule sua economia e peça seu orçamento.",
  },
  // Empresa fictícia: sem número nem e-mail reais. Preencha os dois ao desligar o modo conceito
  // (o WhatsApp com DDI 55 e DDD, ex.: "55 65 99999-8888").
  whatsapp: "",
  mensagemWhatsapp: "Olá! Quero um orçamento de energia solar.",
  emailPedidos: "",
  remetente: "",
  horario: [
    { dias: "Segunda a sexta", horas: "das 7h às 17h" },
    { dias: "Sábado", horas: "das 7h às 11h" },
  ],
  horarioSchema: ["Mo-Fr 07:00-17:00", "Sa 07:00-11:00"],
  cidades: [
    "Cuiabá",
    "Várzea Grande",
    "Chapada dos Guimarães",
    "Santo Antônio de Leverger",
    "Nossa Senhora do Livramento",
    "Poconé",
    "Jangada",
    "Acorizal",
    "Barão de Melgaço",
  ],
  numeros: [
    { valor: "1.200", rotulo: "sistemas instalados" },
    { valor: "8 MWp", rotulo: "em operação" },
    { valor: "9", rotulo: "cidades atendidas" },
  ],
  fundacao: { ano: 2016, bairro: "Coxipó" },
  mapa: { consulta: "Cuiabá, MT", legenda: "Cuiabá-MT · atendimento no local com hora marcada" },
};
