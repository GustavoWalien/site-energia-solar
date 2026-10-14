"use client";

import { useActionState, useEffect, useRef } from "react";
import { enviarPedido, type EstadoPedido } from "@/app/actions/pedido";
import { config } from "@/content/config";
import { formulario as t } from "@/content/formulario";
import type { CampoPedido } from "@/content/tipos";
import { CAMPOS } from "@/lib/pedido";
import { preencher } from "@/lib/texto";

const INICIAL: EstadoPedido = { status: "inicial" };

/** Formulário de pedido de orçamento. Funciona sem JavaScript (POST nativo); com ele, mostra erros e estados na hora. */
export function FormularioPedido() {
  const [estado, enviar, enviando] = useActionState(enviarPedido, INICIAL);
  const form = useRef<HTMLFormElement>(null);
  const carimbo = useRef<HTMLInputElement>(null);
  const apareceu = useRef(0);

  // O carimbo guarda a hora em que o formulário apareceu, e não a do último envio: quem corrige um erro e
  // reenvia logo em seguida não pode parecer robô. O React limpa o formulário depois de cada envio.
  useEffect(() => {
    if (!apareceu.current) apareceu.current = Date.now();
    if (carimbo.current) carimbo.current.value = String(apareceu.current);
  }, [estado]);

  useEffect(() => {
    if (estado.status !== "invalido") return;
    const primeiro = CAMPOS.find((campo) => estado.erros[campo]);
    if (primeiro) form.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
  }, [estado]);

  const valores = estado.status === "invalido" || estado.status === "falha" ? estado.valores : {};
  const erros = estado.status === "invalido" ? estado.erros : {};
  const enviado = estado.status === "enviado";
  const envio = estado.status === "invalido" || estado.status === "falha" ? estado.envio : 0;

  const marcar = (campo: CampoPedido) => ({
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `pedido-${campo}-erro` : undefined,
  });
  const erro = (campo: CampoPedido) =>
    erros[campo] ? (
      <p className="pedido__erro" id={`pedido-${campo}-erro`}>
        {erros[campo]}
      </p>
    ) : null;

  return (
    <>
      <div className="pedido__status" role="status">
        {enviado && <p>{preencher(config.modoConceito ? t.sucessoConceito : t.sucesso, { nome: estado.nome })}</p>}
      </div>
      {!enviado && (
        <form key={envio} ref={form} action={enviar} className="pedido" noValidate>
          <div className="pedido__campo">
            <label htmlFor="pedido-nome">{t.campos.nome}</label>
            <input
              id="pedido-nome"
              name="nome"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              defaultValue={valores.nome ?? ""}
              {...marcar("nome")}
            />
            {erro("nome")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-whatsapp">{t.campos.whatsapp}</label>
            <input
              id="pedido-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              defaultValue={valores.whatsapp ?? ""}
              {...marcar("whatsapp")}
            />
            {erro("whatsapp")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-cidade">
              {t.campos.cidade} <span className="pedido__opcional">({t.opcional})</span>
            </label>
            <input
              id="pedido-cidade"
              name="cidade"
              type="text"
              autoComplete="address-level2"
              maxLength={80}
              defaultValue={valores.cidade ?? ""}
              {...marcar("cidade")}
            />
            {erro("cidade")}
          </div>
          <div className="pedido__campo">
            <label htmlFor="pedido-conta">{t.campos.conta}</label>
            <select id="pedido-conta" name="conta" required defaultValue={valores.conta ?? ""} {...marcar("conta")}>
              <option value="" disabled>
                {t.escolha}
              </option>
              {t.opcoesConta.map((opcao) => (
                <option key={opcao}>{opcao}</option>
              ))}
            </select>
            {erro("conta")}
          </div>
          <fieldset className="pedido__campo pedido__opcoes">
            <legend>{t.campos.onde}</legend>
            {t.opcoesOnde.map((opcao) => (
              <label key={opcao} className="pedido__opcao">
                <input
                  type="radio"
                  name="onde"
                  value={opcao}
                  required
                  defaultChecked={valores.onde === opcao}
                  {...marcar("onde")}
                />
                {opcao}
              </label>
            ))}
            {erro("onde")}
          </fieldset>
          <div className="pedido__campo">
            <label htmlFor="pedido-mensagem">
              {t.campos.mensagem} <span className="pedido__opcional">({t.opcional})</span>
            </label>
            <textarea
              id="pedido-mensagem"
              name="mensagem"
              rows={4}
              maxLength={1000}
              defaultValue={valores.mensagem ?? ""}
              {...marcar("mensagem")}
            />
            {erro("mensagem")}
          </div>
          <div className="pedido__armadilha" aria-hidden="true">
            <label htmlFor="pedido-site">Site</label>
            <input id="pedido-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input ref={carimbo} type="hidden" name="inicio" defaultValue="" />
          {estado.status === "falha" && (
            <p className="pedido__falha" role="alert">
              {t.erros.envio}
            </p>
          )}
          {config.modoConceito && <p className="pedido__aviso">{t.aviso}</p>}
          <button className="botao botao--ipe pedido__botao" type="submit" disabled={enviando}>
            {enviando ? t.enviando : t.botao}
          </button>
          <p className="pedido__privacidade">{t.privacidade}</p>
        </form>
      )}
    </>
  );
}
