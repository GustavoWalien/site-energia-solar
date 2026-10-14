import type { TextosInicio } from "./tipos";

export const inicio: TextosInicio = {
  hero: {
    faixas: [
      {
        rotulo: "Energia solar em Cuiabá",
        titulo: [{ texto: "Em Cuiabá, o sol " }, { texto: "chega cedo", destaque: true }, { texto: "." }],
        apoio: "E fica o dia inteiro. Ele pode pagar a sua conta de luz.",
      },
      {
        rotulo: "Placas ligadas",
        titulo: [{ texto: "Seu telhado vira uma " }, { texto: "usina", destaque: true }, { texto: "." }],
        apoio: "Cada placa transforma luz em energia. O ar-condicionado liga e quem paga a conta é o sol.",
      },
      {
        rotulo: "Conta mais leve",
        titulo: [{ texto: "Energia do sol, direto na " }, { texto: "sua conta", destaque: true }, { texto: "." }],
        apoio: "A gente faz o projeto, instala e cuida da liberação com a Energisa. Você só acompanha a conta baixar.",
      },
    ],
    botaoOrcamento: "Peça seu orçamento",
    botaoSimular: "Simule sua economia",
    dica: "Role para o sol nascer",
    painel: { lugar: "Cuiabá", gerando: "Gerando" },
  },
  oQueFazemos: { rotulo: "O que a gente faz", titulo: "Do telhado da casa ao pivô da fazenda." },
  simulador: {
    rotulo: "Simule em 10 segundos",
    titulo: "Quanto você paga de luz por mês?",
    controle: "Valor médio da sua conta de luz",
    sistema: "Sistema sugerido",
    economia: "Economia estimada",
    ano: "Em um ano",
    porMes: "por mês",
    aviso:
      "Estimativa simples para começar a conversa. O valor real depende do telhado, das sombras e do seu consumo ao longo do ano.",
    comoTitulo: "Como essa conta é feita",
    comoTexto: [
      "Dividimos a conta pela tarifa da Energisa MT com impostos, de R$ 1,15 por kWh, para achar o consumo do mês.",
      "Tiramos a taxa mínima de 50 kWh, que a Energisa cobra mesmo de quem gera a própria energia.",
      "Calculamos quantas placas de 585 W geram o resto, contando 4,3 kWh por kWp por dia, uma média conservadora para Cuiabá.",
      "A economia desconta 15% pelo Fio B de 2026 e aparece numa faixa de 7% para mais ou para menos.",
    ],
    botao: "Quero a simulação completa",
    mensagem: "Olá! Minha conta de luz fica em torno de R$ {valor}. Quero uma simulação.",
  },
  comoFunciona: {
    titulo: "Do primeiro oi à conta mais leve.",
    passos: [
      {
        titulo: "Mande sua conta de luz.",
        texto: "Uma foto da última conta já basta. Com ela a gente vê seu consumo e o tipo de ligação.",
      },
      {
        titulo: "Visita técnica.",
        texto: "Olhamos o telhado, as sombras e o padrão de entrada. Fotografamos tudo antes de mexer.",
      },
      {
        titulo: "Instalação.",
        texto: "Numa casa, a obra leva de 1 a 3 dias, e a equipe deixa o telhado como encontrou.",
      },
      {
        titulo: "Liberação e economia.",
        texto:
          "Pedimos a liberação na Energisa e mandamos o número do protocolo para você acompanhar. Quando o medidor novo chega, a economia começa.",
      },
    ],
  },
  promessas: {
    titulo: "O que a gente promete, por escrito.",
    itens: [
      {
        titulo: "Gente de verdade no atendimento.",
        texto:
          "Você fala com quem desenhou o seu projeto, no WhatsApp ou no telefone. Nada de resposta automática.",
        icone: "atendimento",
      },
      {
        titulo: "Telhado protegido.",
        texto:
          "Fotografamos o telhado antes e depois. Se uma telha quebrar na instalação, a troca é por nossa conta.",
        icone: "telhado",
      },
      {
        titulo: "Proposta sem letra miúda.",
        texto: "Marca e modelo de cada equipamento, prazo, garantia e forma de pagamento, tudo no papel.",
        icone: "proposta",
      },
      {
        titulo: "Liberação com protocolo.",
        texto:
          "Você recebe o número do pedido na Energisa e um aviso a cada etapa, sem precisar ficar ligando para saber.",
        icone: "protocolo",
      },
    ],
  },
  depoimentos: {
    titulo: "Quem já liga o ar sem susto.",
    nota: "Depoimentos ilustrativos de um projeto conceito.",
  },
  perguntas: { titulo: "Perguntas frequentes" },
  chamadaFinal: {
    titulo: "Mande uma foto da sua conta de luz.",
    apoio: "A gente responde com uma estimativa de economia, sem compromisso.",
    botao: "Chamar no WhatsApp",
    formulario: "Prefere formulário? A gente liga para você.",
  },
};
