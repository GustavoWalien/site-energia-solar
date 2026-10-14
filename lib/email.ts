import { Resend } from "resend";
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
 * Para onde vai o pedido. No modo conceito, para o autor, pelo remetente do domínio dele verificado no Resend.
 * Fora dele, para a empresa, pelo remetente verificado dela.
 */
export function destinoDoPedido(config: Config, empresa: Empresa): Destino {
  if (config.modoConceito) return { para: config.autor.email, de: config.autor.remetente };
  return { para: empresa.emailPedidos, de: empresa.remetente };
}

/** Transporte dos testes: nada sai para a rede. "Teste Falha" no assunto simula uma falha. */
export const transporteTeste: Transporte = async (email) => ({ ok: !email.assunto.includes("Teste Falha") });

/** Sem chave do Resend, o envio avisa no log, sem dados do pedido, e falha. */
export const transporteIndisponivel: Transporte = async () => {
  console.error("Envio de e-mail não configurado: falta RESEND_API_KEY (integração do Resend na Vercel).");
  return { ok: false };
};

/** Quanto o envio espera pelo Resend antes de desistir. */
export const LIMITE_ENVIO_MS = 10_000;

/** O que o transporte usa do SDK do Resend. Os testes passam um cliente falso, sem rede. */
export type ClienteResend = {
  emails: {
    send(dados: {
      from: string;
      to: string[];
      subject: string;
      text: string;
    }): Promise<{ error: { name?: string; message?: string } | null }>;
  };
};

/**
 * Envio pelo Resend (guia: `vercel integration guide resend`). O log leva só o tipo do erro: a mensagem do Resend
 * pode trazer o endereço de e-mail, e dado pessoal não vai para o log. Fora de produção, o próprio SDK escreve o erro
 * inteiro no console antes de devolvê-lo (logError em node_modules/resend); em produção ele não escreve.
 */
export function transporteResend(cliente: ClienteResend, limiteMs = LIMITE_ENVIO_MS): Transporte {
  return async (email) => {
    let relogio: ReturnType<typeof setTimeout> | undefined;
    // Resend travado: desiste no limite, para quem pediu ver a falha (com o WhatsApp) em vez de esperar sem fim
    const esgotou = new Promise<"esgotou">((resolver) => {
      relogio = setTimeout(() => resolver("esgotou"), limiteMs);
    });
    try {
      const resposta = await Promise.race([
        cliente.emails.send({ from: email.de, to: [email.para], subject: email.assunto, text: email.texto }),
        esgotou,
      ]);
      if (resposta === "esgotou") {
        console.error(`O Resend não respondeu em ${limiteMs / 1000} s: o pedido não foi enviado.`);
        return { ok: false };
      }
      const { error } = resposta;
      if (error) {
        console.error(`O Resend recusou o envio do pedido (${error.name ?? "erro sem tipo"}).`);
        return { ok: false };
      }
      return { ok: true };
    } catch {
      console.error("Falha de rede ao chamar o Resend: o pedido não foi enviado.");
      return { ok: false };
    } finally {
      clearTimeout(relogio);
    }
  };
}

/** Nos testes, nada sai para a rede. Com a chave da integração, o envio vai pelo Resend. */
export function escolherTransporte(
  env: Record<string, string | undefined> = process.env,
  criarCliente: (chave: string) => ClienteResend = (chave) => new Resend(chave),
): Transporte {
  if (env.EMAIL_TRANSPORTE === "teste") return transporteTeste;
  if (env.RESEND_API_KEY) return transporteResend(criarCliente(env.RESEND_API_KEY));
  return transporteIndisponivel;
}
