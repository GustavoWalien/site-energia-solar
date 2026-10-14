import type { TextosPaginas } from "./tipos";

/** Textos da lista de serviços, da página de serviço, da Sobre, da Contato e da 404 (docs/textos.md, seções 4 a 6). */
export const paginas: TextosPaginas = {
  servicos: {
    seo: {
      titulo: "Serviços de energia solar em Cuiabá",
      descricao:
        "Energia solar para casas, empresas e fazendas em Cuiabá e região, e limpeza de placas. Veja o que está incluído em cada serviço e peça seu orçamento.",
    },
    rotulo: "Serviços",
    titulo: "Escolha o serviço que cabe no seu telhado.",
    apoio:
      "Casa, empresa, fazenda ou só a limpeza das placas. Em cada página você vê o que está incluído e as dúvidas mais comuns.",
  },
  servico: {
    trilhaInicio: "Início",
    trilhaServicos: "Serviços",
    botao: "Peça seu orçamento",
    mensagem: "Olá! Vi a página de {servico} e quero um orçamento.",
    perguntas: "Perguntas sobre este serviço",
  },
  sobre: {
    seo: {
      titulo: "Sobre a Ipê Solar | Energia solar em Cuiabá",
      descricao:
        "A Ipê Solar nasceu em 2016 no Coxipó. Hoje são 18 pessoas cuidando de energia solar em Cuiabá e região. Conheça a história, os números e a equipe.",
      absoluto: true,
    },
    rotulo: "Sobre a Ipê Solar",
    titulo: "Gente de Cuiabá cuidando do seu telhado.",
    historia:
      "A Ipê Solar começou em 2016, numa garagem no Coxipó, com dois eletricistas e uma ideia simples: se o sol de Cuiabá castiga, ele também pode pagar a conta. O nome veio do ipê-amarelo, que floresce no auge da seca, quando o sol está mais forte. Hoje somos 18 pessoas, entre engenheiros, projetistas e instaladores.",
    numerosTitulo: "A Ipê Solar em números",
    equipeTitulo: "Quem cuida do seu projeto",
    ondeTitulo: "Onde atendemos",
    ondeApoio: "Cuiabá e as cidades da Baixada Cuiabana. Mora mais longe? Chame no WhatsApp que a gente avalia.",
  },
  contato: {
    seo: {
      titulo: "Contato | Ipê Solar Cuiabá",
      descricao:
        "Fale com a Ipê Solar pelo WhatsApp ou deixe seus dados no formulário. Atendimento em Cuiabá e região, de segunda a sábado, com visita marcada.",
      absoluto: true,
    },
    titulo: "Fale com a gente.",
    apoio: "O jeito mais rápido é o WhatsApp. Se preferir, deixe seus dados no formulário que a gente liga.",
    blocosRotulo: "Formas de contato",
    whatsappTitulo: "WhatsApp",
    whatsappTexto: "Mande uma foto da conta de luz e a gente responde com uma estimativa.",
    whatsappBotao: "Chamar no WhatsApp",
    telefone: "Telefone",
    horario: "Horário",
    local: "Onde estamos",
    mapaTitulo: "Mapa de Cuiabá, MT",
    abrirMapa: "Abrir no Google Maps",
  },
  naoEncontrada: {
    seo: {
      titulo: "Página não encontrada",
      descricao: "Essa página não existe mais ou mudou de endereço. Volte para a Início da Ipê Solar, energia solar em Cuiabá.",
    },
    titulo: "Essa página tomou sombra.",
    texto: "O endereço pode ter mudado ou nunca ter existido. A Início está logo ali, no sol.",
    botao: "Voltar para a Início",
  },
};
