"use client";

import { useEffect, useRef, useState } from "react";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";
import { MapaDesenhado } from "./MapaDesenhado";

const consulta = encodeURIComponent(empresa.mapa.consulta);
const embutido = `https://www.google.com/maps?q=${consulta}&z=12&output=embed`;
const abrir = `https://www.google.com/maps?q=${consulta}`;

/**
 * Cartão do mapa: o desenho aparece na hora, e o iframe do Google só entra quando o cartão chega a 300 px da tela,
 * com um fade. O cartão tem a mesma altura antes e depois, e o link para o Google Maps fica sempre visível.
 */
export function Mapa() {
  const quadro = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setPerto(true);
        observador.disconnect();
      },
      { rootMargin: "300px" },
    );
    observador.observe(el);
    // sinal de que o mapa já está observando a tela (o teste do carregamento preguiçoso espera por ele)
    el.dataset.observando = "";
    return () => {
      observador.disconnect();
      delete el.dataset.observando;
    };
  }, []);

  return (
    <figure className="mapa">
      <div ref={quadro} className="mapa__quadro">
        <MapaDesenhado className="mapa__desenho" />
        {perto && (
          <iframe
            className={pronto ? "mapa__iframe mapa__iframe--pronto" : "mapa__iframe"}
            src={embutido}
            title={paginas.contato.mapaTitulo}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setPronto(true)}
          />
        )}
      </div>
      <figcaption className="mapa__legenda">
        <span>{empresa.mapa.legenda}</span>
        <a href={abrir} target="_blank" rel="noopener">
          {paginas.contato.abrirMapa}
        </a>
      </figcaption>
    </figure>
  );
}
