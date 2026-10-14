import type { ReactNode } from "react";
import { Rotulo } from "./Rotulo";

type Props = { id: string; titulo: string; rotulo?: string; className?: string; children: ReactNode };

/** Seção da página: rótulo opcional, título H2 e conteúdo, na largura do site. */
export function Secao({ id, titulo, rotulo, className, children }: Props) {
  return (
    <section id={id} className={className ? `secao ${className}` : "secao"} aria-labelledby={`${id}-titulo`}>
      <div className="secao__miolo">
        {rotulo && <Rotulo>{rotulo}</Rotulo>}
        <h2 id={`${id}-titulo`} className="secao__titulo">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}
