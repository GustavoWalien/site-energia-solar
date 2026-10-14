export type LinkMenu = { rotulo: string; href: string };

export type Autor = {
  nome: string;
  /** Número com DDI 55 e DDD, em qualquer formato. Ex.: "55 65 98122-2210". */
  whatsapp: string;
  mensagemWhatsapp: string;
  email: string;
  portfolio: string;
};

export type Config = {
  /** Ligado: empresa fictícia, contatos vão para o autor e os avisos aparecem. Desligado: cliente real. */
  modoConceito: boolean;
  autor: Autor;
};

export type Horario = { dias: string; horas: string };

export type Numero = { valor: string; rotulo: string };

export type Empresa = {
  nome: string;
  frase: string;
  cidade: string;
  estado: string;
  /** Título e descrição padrão (página Início e páginas sem metadados próprios). */
  seo: { titulo: string; descricao: string };
  /** WhatsApp da empresa, com DDI 55 e DDD, em qualquer formato. Ex.: "55 65 99999-8888". Só é usado com o modo conceito desligado. */
  whatsapp: string;
  mensagemWhatsapp: string;
  /** E-mail que recebe os pedidos. Só é usado com o modo conceito desligado. */
  emailPedidos: string;
  horario: Horario[];
  /** O mesmo horário no formato do schema.org, ex.: "Mo-Fr 07:00-17:00". */
  horarioSchema: string[];
  cidades: string[];
  numeros: Numero[];
  fundacao: { ano: number; bairro: string };
  mapa: { consulta: string; legenda: string };
};

export type TextosConceito = {
  aviso: {
    selo: string;
    titulo: string;
    texto: string;
    botaoAutor: string;
    botaoFechar: string;
    fecharRotulo: string;
  };
  rodape: string;
};

/** Pedaço de um título. `destaque` ganha o realce amarelo. */
export type Trecho = { texto: string; destaque?: boolean };

export type FaixaHero = { rotulo: string; titulo: Trecho[]; apoio: string };

export type TextosHero = {
  /** Madrugada, manhã e meio-dia, nesta ordem. O rótulo da primeira faixa faz parte do H1. */
  faixas: [FaixaHero, FaixaHero, FaixaHero];
  botaoOrcamento: string;
  botaoSimular: string;
  dica: string;
  painel: { lugar: string; gerando: string };
};

export type Passo = { titulo: string; texto: string };

export type IconePromessa = "atendimento" | "telhado" | "proposta" | "protocolo";

export type Promessa = { titulo: string; texto: string; icone: IconePromessa };

export type TextosInicio = {
  hero: TextosHero;
  oQueFazemos: { rotulo: string; titulo: string };
  simulador: {
    rotulo: string;
    titulo: string;
    controle: string;
    sistema: string;
    economia: string;
    ano: string;
    porMes: string;
    aviso: string;
    comoTitulo: string;
    comoTexto: string[];
    botao: string;
    /** "{valor}" vira o valor escolhido, ex.: "1.200". */
    mensagem: string;
  };
  comoFunciona: { titulo: string; passos: Passo[] };
  promessas: { titulo: string; itens: Promessa[] };
  depoimentos: { titulo: string; nota: string };
  perguntas: { titulo: string };
  chamadaFinal: { titulo: string; apoio: string; botao: string; formulario: string };
};

export type IconeServico = "casa" | "empresa" | "campo" | "limpeza";

export type Servico = {
  slug: string;
  /** Nome do serviço, usado no link do cartão. Ex.: "Energia solar para casa". */
  nome: string;
  icone: IconeServico;
  cartao: { titulo: string; texto: string };
};

export type Pergunta = { pergunta: string; resposta: string };

export type Depoimento = { texto: string; nome: string; lugar: string; tipo: string };

export type ConstantesSimulador = {
  /** R$ por kWh, com impostos. */
  tarifa: number;
  taxaMinimaKwh: number;
  geracaoKwhPorKwpDia: number;
  potenciaPlacaW: number;
  /** De 0 a 1. */
  perdaFioB: number;
  /** De 0 a 1: a faixa vai de (1 − margem) a (1 + margem). */
  margem: number;
  minimo: number;
  maximo: number;
  passo: number;
  inicial: number;
};

export type CampoPedido = "nome" | "whatsapp" | "cidade" | "conta" | "onde" | "mensagem";

export type TextosFormulario = {
  campos: Record<CampoPedido, string>;
  opcional: string;
  escolha: string;
  opcoesConta: string[];
  opcoesOnde: string[];
  botao: string;
  enviando: string;
  privacidade: string;
  /** Linha acima do botão, só no modo conceito. */
  aviso: string;
  erros: {
    nome: string;
    nomeLongo: string;
    whatsapp: string;
    cidade: string;
    conta: string;
    onde: string;
    mensagem: string;
    envio: string;
  };
  /** "{nome}" vira o nome de quem pediu. */
  sucesso: string;
  sucessoConceito: string;
};
