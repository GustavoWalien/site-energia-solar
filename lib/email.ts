import type { Config, Empresa } from "@/content/tipos";
import type { Pedido } from "./pedido";

export type Email = { para: string; de: string; assunto: string; texto: string };
export type Destino = { para: string; de: string };
export type Transporte = (email: Email) => Promise<{ ok: boolean }>;

/** O e-mail do pedido, em texto simples. */
export function montarEmail(pedido: Pedido, destino: Destino, siteUrl: string): Email {
  const linhas = [
    `Nome: ${pedido.nome}`,
    `WhatsApp: ${pedido.whatsapp}`,
    `Cidade e bairro: ${pedido.cidade || "não informado"}`,
    `Valor médio da conta: ${pedido.conta}`,
    `Onde quer instalar: ${pedido.onde}`,
    `Mensagem: ${pedido.mensagem || "sem mensagem"}`,
    "",
    `Enviado pelo formulário de ${siteUrl}`,
  ];
  return { ...destino, assunto: `Pedido de orçamento: ${pedido.nome} (${pedido.onde})`, texto: linhas.join("\n") };
}

/**
 * Para onde vai o pedido. No modo conceito, para o autor, pelo remetente de teste do Resend (sem domínio
 * verificado, o Resend só entrega para o dono da conta). Fora dele, para a empresa, pelo remetente verificado.
 */
export function destinoDoPedido(config: Config, empresa: Empresa): Destino {
  if (config.modoConceito) return { para: config.autor.email, de: "onboarding@resend.dev" };
  return { para: empresa.emailPedidos, de: empresa.remetente };
}

/** Transporte dos testes: nada sai para a rede. "Teste Falha" no assunto simula uma falha. */
export const transporteTeste: Transporte = async (email) => ({ ok: !email.assunto.includes("Teste Falha") });

/** Até o Plano 5 (integração do Resend pela Vercel), o envio real avisa no log, sem dados do pedido, e falha. */
export const transporteIndisponivel: Transporte = async () => {
  console.error("Envio de e-mail não configurado: a integração do Resend chega no Plano 5.");
  return { ok: false };
};

export function escolherTransporte(env: Record<string, string | undefined> = process.env): Transporte {
  return env.EMAIL_TRANSPORTE === "teste" ? transporteTeste : transporteIndisponivel;
}
