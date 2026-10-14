import type { Pergunta } from "@/content/tipos";

/** Perguntas em details/summary: funcionam sem JavaScript e pelo teclado (estilo em perguntas.css). */
export function ListaPerguntas({ perguntas }: { perguntas: Pergunta[] }) {
  return (
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
  );
}
