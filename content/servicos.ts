import type { Servico } from "./tipos";

/** Os serviços da empresa: os cartões da Início e as páginas /servicos/{slug} (docs/textos.md, seção 4). */
export const servicos: Servico[] = [
  {
    slug: "energia-solar-residencial",
    nome: "Energia solar para casa",
    icone: "casa",
    cartao: {
      titulo: "Ar ligado sem medo da conta.",
      texto: "Um sistema do tamanho do seu consumo, com app para ver quanto a casa gera por dia.",
    },
    seo: {
      titulo: "Energia solar residencial em Cuiabá",
      descricao:
        "Placas solares para casa em Cuiabá e Várzea Grande: projeto, instalação e liberação na Energisa. Simule sua economia e peça orçamento.",
    },
    h1: "Energia solar para casa em Cuiabá",
    abertura:
      "Em Cuiabá, o ar-condicionado é o que mais pesa na conta. Um sistema bem dimensionado gera de dia a energia que a casa usa e manda o que sobra para a Energisa. Essa sobra vira crédito para a noite e para os meses de chuva.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Visita técnica e projeto assinado por engenheiro",
        "Placas e inversor com garantia por escrito",
        "Instalação com fotos do telhado antes e depois",
        "Pedido de liberação na Energisa",
        "App para acompanhar a geração",
        "Suporte depois da instalação",
      ],
    },
    extra: {
      titulo: "Faz mais sentido se",
      itens: [
        "Sua conta passa de R$ 250 por mês (referência do projeto conceito)",
        "O telhado pega sol boa parte do dia",
        "Você pretende ficar no imóvel por alguns anos",
      ],
    },
    perguntas: [
      {
        pergunta: "Dá para instalar em telha de fibrocimento?",
        resposta: "Dá, com suporte próprio para esse tipo de telha. Na visita a gente confere a estrutura.",
      },
      {
        pergunta: "E se eu aumentar o consumo depois?",
        resposta:
          "Dá para acrescentar placas mais tarde, se o inversor e o telhado comportarem. Por isso o projeto já considera planos como comprar outro ar-condicionado.",
      },
    ],
  },
  {
    slug: "energia-solar-para-empresas",
    nome: "Energia solar para empresas",
    icone: "empresa",
    cartao: {
      titulo: "Conta menor, margem maior.",
      texto: "Comércios, clínicas e escritórios gastam energia de dia, justamente quando as placas geram.",
    },
    seo: {
      titulo: "Energia solar para empresas em Cuiabá",
      descricao:
        "Energia solar para comércios, clínicas, escolas e indústrias em Cuiabá. Quem consome de dia aproveita a energia na hora. Peça um estudo de economia.",
    },
    h1: "Energia solar para empresas em Cuiabá",
    abertura:
      "Quem trabalha de dia usa a energia na mesma hora em que as placas geram. Essa energia não passa pela rede, fica fora da cobrança do Fio B, e a economia aparece mais rápido.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Estudo de consumo com as últimas 12 contas",
        "Projeto com ART de engenheiro",
        "Instalação planejada para não parar o seu negócio",
        "Monitoramento e relatório mensal de geração",
      ],
    },
    extra: {
      titulo: "Para quem",
      itens: [
        "Comércio e lojas",
        "Clínicas e consultórios",
        "Escolas e academias",
        "Supermercados e padarias",
        "Oficinas e pequenas indústrias",
      ],
    },
    perguntas: [
      {
        pergunta: "A empresa pode financiar?",
        resposta:
          "Pode. Há linhas de crédito para energia solar em bancos e cooperativas, e o projeto já sai com os documentos que eles pedem.",
      },
      {
        pergunta: "Precisamos parar o expediente na instalação?",
        resposta: "Quase nunca. A troca de ligação leva algumas horas, e a gente combina o melhor horário.",
      },
    ],
  },
  {
    slug: "energia-solar-rural",
    nome: "Energia solar rural",
    icone: "campo",
    cartao: {
      titulo: "Pivô, bomba e ordenha no sol.",
      texto: "Placas no telhado do galpão ou no chão, com projeto pronto para financiamento rural.",
    },
    seo: {
      titulo: "Energia solar rural em Mato Grosso",
      descricao:
        "Energia solar para fazendas e sítios em Mato Grosso: irrigação, bombas, ordenha e galpões. Projeto pronto para financiamento rural.",
    },
    h1: "Energia solar para fazenda e sítio",
    abertura:
      "No campo, energia é custo de produção. Irrigação, bombas, ordenha e resfriamento funcionam todo dia. Com placas no telhado do galpão ou no chão, a propriedade gera a própria energia e a conta fica previsível.",
    incluido: {
      titulo: "O que está incluído",
      itens: [
        "Estudo das contas de todas as unidades da propriedade",
        "Sistema em solo ou no telhado",
        "Documentação para crédito rural (FCO Rural e linhas de bancos e cooperativas)",
        "Monitoramento à distância",
      ],
    },
    extra: {
      titulo: "Usos",
      itens: [
        "Irrigação e pivô central",
        "Bombeamento de água",
        "Ordenha e resfriador de leite",
        "Galpões, armazéns e secadores",
        "Casa da sede",
      ],
    },
    perguntas: [
      {
        pergunta: "O sistema resolve a falta de energia na fazenda?",
        resposta:
          "Sozinho, não. Por segurança, o sistema ligado à rede desliga quando a energia da rede cai. Para isso existe o sistema com bateria, que a gente também projeta.",
      },
      {
        pergunta: "Dá para usar a energia da fazenda em outra conta?",
        resposta:
          "Dá. Os créditos podem abater outras contas no seu nome dentro da área da Energisa. Isso se chama autoconsumo remoto.",
      },
    ],
  },
  {
    slug: "limpeza-de-placas-solares",
    nome: "Limpeza de placas",
    icone: "limpeza",
    cartao: {
      titulo: "Placa suja gera menos.",
      texto: "Na seca, poeira e fuligem das queimadas cobrem as placas. A limpeza devolve a geração.",
    },
    seo: {
      titulo: "Limpeza de placas solares em Cuiabá",
      descricao:
        "Limpeza e manutenção de placas solares em Cuiabá. Na seca, poeira e fuligem derrubam a geração. Atendemos sistemas de qualquer instaladora.",
    },
    h1: "Limpeza e manutenção de placas solares em Cuiabá",
    abertura:
      "De agosto a setembro, a seca e as queimadas deixam poeira e fuligem sobre as placas. A sujeira tapa a luz, e o sistema gera menos mesmo com sol forte.",
    incluido: {
      titulo: "O que a gente faz",
      itens: [
        "Limpeza com água e escova macia, sem produto que risque o vidro",
        "Inspeção de cabos, conectores e fixação no telhado",
        "Checagem do inversor e da geração no app",
        "Relatório com fotos antes e depois",
      ],
    },
    extra: {
      titulo: "Planos",
      itens: [
        "Limpeza avulsa, quando você precisar",
        "Plano anual com duas visitas: uma antes da seca e outra no meio dela",
      ],
    },
    perguntas: [
      {
        pergunta: "Posso limpar sozinho?",
        resposta:
          "Se as placas estão ao alcance do chão, pode. Use só água e pano ou escova macia, de manhã cedo ou no fim da tarde. Em telhado, chame quem tem equipamento de segurança.",
      },
      {
        pergunta: "Vocês atendem sistema instalado por outra empresa?",
        resposta: "Atendemos. A gente faz um check-up e mostra o que está bem e o que precisa de ajuste.",
      },
    ],
  },
];
