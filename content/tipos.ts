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
