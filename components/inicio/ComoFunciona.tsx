import type { CSSProperties } from "react";
import { Revelar } from "@/components/ui/Revelar";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";

const t = inicio.comoFunciona;

/** Os quatro passos, ligados pelo pontilhado amarelo do caminho do sol, que se desenha quando a seção aparece. */
export function ComoFunciona() {
  return (
    <Secao id="como-funciona" titulo={t.titulo} className="como">
      <Revelar className="como__trilha">
        <div className="como__caminho" aria-hidden="true">
          <div className="como__pontos" />
        </div>
        <ol className="como__passos">
          {t.passos.map((passo, i) => (
            <li key={passo.titulo} className="como__passo revelar__item" style={{ "--ordem": i } as CSSProperties}>
              <span className="como__numero" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="como__cartao">
                <h3 className="como__titulo">{passo.titulo}</h3>
                <p className="como__texto">{passo.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Revelar>
    </Secao>
  );
}
