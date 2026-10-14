import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { FaixaHero } from "@/content/tipos";
import { dividirEmPalavras, textoCorrido } from "./geometria";

type Props = { indice: number; faixa: FaixaHero; titulo?: "h1" | "p"; id?: string; children?: ReactNode };

/** Uma faixa de texto do hero. O título vai inteiro para o leitor de tela e em palavras para a montagem. */
export function Faixa({ indice, faixa, titulo: Titulo = "p", id, children }: Props) {
  const classes = [
    "hero__faixa",
    `hero__faixa--${indice + 1}`,
    indice === 0 ? "hero__faixa--escura" : "hero__faixa--clara",
    indice === 2 ? "hero__faixa--final" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} data-faixa={indice}>
      <Titulo className="hero__titulo" id={id}>
        <span className="hero__rotulo">{faixa.rotulo}</span>
        <span className="sr-only">{textoCorrido(faixa.titulo)}</span>
        <span className="hero__frase" aria-hidden="true">
          {dividirEmPalavras(faixa.titulo).map((palavra) => (
            <Fragment key={palavra.i}>
              {palavra.i > 0 && " "}
              <span className="hero__palavra" style={{ "--i": palavra.i } as CSSProperties}>
                {palavra.partes.map((parte, j) => (parte.destaque ? <em key={j}>{parte.texto}</em> : parte.texto))}
              </span>
            </Fragment>
          ))}
        </span>
      </Titulo>
      <p className="hero__apoio">{faixa.apoio}</p>
      {children}
    </div>
  );
}
