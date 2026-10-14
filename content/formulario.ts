import type { TextosFormulario } from "./tipos";

export const formulario: TextosFormulario = {
  campos: {
    nome: "Nome",
    whatsapp: "WhatsApp com DDD",
    cidade: "Cidade e bairro",
    conta: "Valor médio da conta",
    onde: "Onde quer instalar",
    mensagem: "Mensagem",
  },
  opcional: "opcional",
  escolha: "Escolha uma opção",
  opcoesConta: ["Até R$ 300", "R$ 300 a R$ 600", "R$ 600 a R$ 1.000", "Mais de R$ 1.000"],
  opcoesOnde: ["Casa", "Empresa", "Fazenda ou sítio"],
  botao: "Quero meu orçamento",
  enviando: "Enviando…",
  privacidade: "Usamos seus dados só para responder este pedido.",
  aviso: "Formulário de demonstração. A mensagem chega para quem fez este site.",
  erros: {
    nome: "Coloque seu nome.",
    nomeLongo: "Use até 80 caracteres no nome.",
    whatsapp: "Confira o número do WhatsApp, com DDD.",
    cidade: "Use até 80 caracteres na cidade e no bairro.",
    conta: "Escolha o valor médio da conta.",
    onde: "Escolha onde quer instalar.",
    mensagem: "Use até 1.000 caracteres na mensagem.",
    envio: "Não conseguimos enviar agora. Tente de novo ou chame a gente no WhatsApp.",
  },
  sucesso: "Pedido recebido, {nome}! Respondemos no WhatsApp em até 1 dia útil.",
  sucessoConceito:
    "Mensagem recebida, {nome}! Como este é um projeto conceito, ela chegou para Gustavo Walien, que fez este site.",
};
