"use client";

import { useId, useState, type CSSProperties } from "react";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { inicio } from "@/content/inicio";
import { constantesSimulador as c } from "@/content/simulador";
import { destinoWhatsapp } from "@/lib/contato";
import { decimal, estimar, milhar, reais } from "@/lib/simulador";
import { preencher } from "@/lib/texto";

const t = inicio.simulador;

/** O simulador de economia: o deslizador da conta de luz e a estimativa na hora. Sem JavaScript, mostra R$ 450. */
export function Simulador() {
  const [conta, setConta] = useState(c.inicial);
  const id = useId();
  const e = estimar(conta, c);
  const destino = destinoWhatsapp(config, empresa, preencher(t.mensagem, { valor: milhar(conta) }));
  const cheio = ((conta - c.minimo) / (c.maximo - c.minimo)) * 100;

  return (
    <div className="simulador">
      <div className="simulador__entrada">
        <label className="simulador__rotulo" htmlFor={`${id}-conta`}>
          {t.controle}
        </label>
        <output className="simulador__valor" htmlFor={`${id}-conta`}>
          {reais(conta)}
        </output>
        <input
          id={`${id}-conta`}
          className="simulador__deslizador"
          type="range"
          min={c.minimo}
          max={c.maximo}
          step={c.passo}
          value={conta}
          aria-valuetext={`${reais(conta)} ${t.porMes}`}
          onChange={(evento) => setConta(Number(evento.target.value))}
          style={{ "--cheio": `${cheio}%` } as CSSProperties}
        />
        <div className="simulador__escala" aria-hidden="true">
          <span>{reais(c.minimo)}</span>
          <span>{reais(c.maximo)}</span>
        </div>
      </div>
      <div className="simulador__resultados" aria-live="polite">
        <div className="simulador__cartao">
          <p className="simulador__nome">{t.sistema}</p>
          <p className="simulador__numero">
            {e.placas} placas · {decimal(e.kwp)} kWp
          </p>
        </div>
        <div className="simulador__cartao simulador__cartao--destaque">
          <p className="simulador__nome">{t.economia}</p>
          <p className="simulador__numero">
            {reais(e.economiaMes[0])} a {reais(e.economiaMes[1])} <small>{t.porMes}</small>
          </p>
        </div>
        <div className="simulador__cartao">
          <p className="simulador__nome">{t.ano}</p>
          <p className="simulador__numero">
            {reais(e.economiaAno[0])} a {reais(e.economiaAno[1])}
          </p>
        </div>
      </div>
      <div className="simulador__rodape">
        <p className="simulador__aviso">{t.aviso}</p>
        <details className="simulador__como">
          <summary>{t.comoTitulo}</summary>
          <ol>
            {t.comoTexto.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
          </ol>
        </details>
        <a
          className="botao botao--ipe"
          href={destino.href}
          target="_blank"
          rel="noopener"
          data-aviso={destino.aviso ? "" : undefined}
        >
          {t.botao}
        </a>
      </div>
    </div>
  );
}
