"use client";

import { useEffect, useRef } from "react";
import type { TextosConceito } from "@/content/tipos";

type Props = { textos: TextosConceito["aviso"]; hrefAutor: string };

/** Janela "Este é um projeto conceito". Intercepta o clique em qualquer link com data-aviso. */
export function AvisoConceito({ textos, hrefAutor }: Props) {
  const janela = useRef<HTMLDialogElement>(null);
  const principal = useRef<HTMLAnchorElement>(null);
  const origem = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialogo = janela.current;
    if (!dialogo) return;
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-aviso]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      origem.current = link;
      dialogo.showModal();
      principal.current?.focus();
    };
    const aoFechar = () => origem.current?.focus();
    const aoClicarNoFundo = (e: MouseEvent) => {
      if (e.target === dialogo) dialogo.close();
    };
    document.addEventListener("click", aoClicar);
    dialogo.addEventListener("close", aoFechar);
    dialogo.addEventListener("click", aoClicarNoFundo);
    return () => {
      document.removeEventListener("click", aoClicar);
      dialogo.removeEventListener("close", aoFechar);
      dialogo.removeEventListener("click", aoClicarNoFundo);
    };
  }, []);

  return (
    <dialog ref={janela} className="aviso" aria-labelledby="aviso-titulo" aria-describedby="aviso-texto">
      <div className="aviso__topo">
        <span className="aviso__selo">{textos.selo}</span>
        <form method="dialog">
          <button className="aviso__fechar" aria-label={textos.fecharRotulo}>
            ×
          </button>
        </form>
      </div>
      <div className="aviso__corpo">
        <h2 id="aviso-titulo">{textos.titulo}</h2>
        <p id="aviso-texto">{textos.texto}</p>
        <div className="aviso__acoes">
          <a
            ref={principal}
            className="botao botao--ipe"
            href={hrefAutor}
            target="_blank"
            rel="noopener"
            onClick={() => janela.current?.close()}
          >
            {textos.botaoAutor}
          </a>
          <form method="dialog">
            <button className="aviso__secundario">{textos.botaoFechar}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
