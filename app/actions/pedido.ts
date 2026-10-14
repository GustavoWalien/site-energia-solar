"use server";

import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { formulario } from "@/content/formulario";
import { destinoDoPedido, escolherTransporte, montarEmail } from "@/lib/email";
import { CAMPOS, pareceRobo, validarPedido, type ErrosPedido } from "@/lib/pedido";
import { SITE_URL } from "@/lib/site";

export type EstadoPedido =
  | { status: "inicial" }
  | { status: "invalido"; erros: ErrosPedido; valores: Record<string, string> }
  | { status: "falha"; valores: Record<string, string> }
  | { status: "enviado"; nome: string };

/** Só os campos visíveis, para preencher o formulário de novo depois de um erro. */
function valoresVisiveis(entrada: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    CAMPOS.map((campo) => {
      const valor = entrada[campo];
      return [campo, typeof valor === "string" ? valor : ""];
    }),
  );
}

/** Ação do formulário de pedido. Robô recebe sucesso sem envio, para não ganhar pista. */
export async function enviarPedido(_anterior: EstadoPedido, dados: FormData): Promise<EstadoPedido> {
  const entrada = Object.fromEntries(dados);
  const valores = valoresVisiveis(entrada);
  if (pareceRobo(entrada, Date.now())) return { status: "enviado", nome: valores.nome.trim() };

  const resultado = validarPedido(entrada, formulario);
  if (!resultado.ok) return { status: "invalido", erros: resultado.erros, valores };

  const email = montarEmail(resultado.pedido, destinoDoPedido(config, empresa), SITE_URL);
  const { ok } = await escolherTransporte()(email);
  return ok ? { status: "enviado", nome: resultado.pedido.nome } : { status: "falha", valores };
}
