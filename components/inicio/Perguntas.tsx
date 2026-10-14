import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";

/** As oito perguntas em details/summary: funcionam sem JavaScript e pelo teclado. */
export function Perguntas() {
  return (
    <Secao id="perguntas" titulo={inicio.perguntas.titulo} className="perguntas">
      <div className="perguntas__lista">
        {perguntas.map((p) => (
          <details key={p.pergunta} className="pergunta">
            <summary className="pergunta__titulo">
              <span>{p.pergunta}</span>
              <span className="pergunta__sinal" aria-hidden="true" />
            </summary>
            <p className="pergunta__resposta">{p.resposta}</p>
          </details>
        ))}
      </div>
    </Secao>
  );
}
