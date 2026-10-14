import type { CampoPedido, TextosFormulario } from "@/content/tipos";

export type Pedido = Record<CampoPedido, string>;
export type ErrosPedido = Partial<Record<CampoPedido, string>>;
export type ResultadoValidacao = { ok: true; pedido: Pedido } | { ok: false; erros: ErrosPedido };

/** Os campos na ordem da tela: o foco vai para o primeiro com erro. */
export const CAMPOS: CampoPedido[] = ["nome", "whatsapp", "cidade", "conta", "onde", "mensagem"];

/** Só os dígitos do WhatsApp, sem o 55: DDD e número, com 10 ou 11 dígitos. Fora disso, null. */
export function normalizarWhatsapp(valor: string): string | null {
  let digitos = valor.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) digitos = digitos.slice(2);
  return digitos.length === 10 || digitos.length === 11 ? digitos : null;
}

const ler = (entrada: Record<string, unknown>, campo: string) => {
  const valor = entrada[campo];
  return typeof valor === "string" ? valor.trim() : "";
};

/** Valida o pedido com as regras da spec (seção 8) e as mensagens de content/formulario.ts. */
export function validarPedido(entrada: Record<string, unknown>, t: TextosFormulario): ResultadoValidacao {
  const nome = ler(entrada, "nome");
  const whatsapp = normalizarWhatsapp(ler(entrada, "whatsapp"));
  const cidade = ler(entrada, "cidade");
  const conta = ler(entrada, "conta");
  const onde = ler(entrada, "onde");
  const mensagem = ler(entrada, "mensagem");

  const erros: ErrosPedido = {};
  if (nome.length < 2) erros.nome = t.erros.nome;
  else if (nome.length > 80) erros.nome = t.erros.nomeLongo;
  if (!whatsapp) erros.whatsapp = t.erros.whatsapp;
  if (cidade.length > 80) erros.cidade = t.erros.cidade;
  if (!t.opcoesConta.includes(conta)) erros.conta = t.erros.conta;
  if (!t.opcoesOnde.includes(onde)) erros.onde = t.erros.onde;
  if (mensagem.length > 1000) erros.mensagem = t.erros.mensagem;

  if (!whatsapp || Object.keys(erros).length > 0) return { ok: false, erros };
  return { ok: true, pedido: { nome, whatsapp, cidade, conta, onde, mensagem } };
}

/**
 * Robô: preencheu o campo armadilha `site` ou enviou menos de 3 segundos depois de o formulário aparecer.
 * Sem JavaScript o carimbo `inicio` vem vazio, e só a armadilha vale.
 */
export function pareceRobo(entrada: Record<string, unknown>, agora: number): boolean {
  if (ler(entrada, "site") !== "") return true;
  const inicio = ler(entrada, "inicio");
  if (inicio === "") return false;
  const quando = Number(inicio);
  return Number.isFinite(quando) && agora - quando < 3000;
}
