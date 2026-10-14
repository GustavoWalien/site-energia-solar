import Link from "next/link";
import type { ReactNode } from "react";
import { Rotulo } from "./Rotulo";

export type ItemTrilha = { rotulo: string; href?: string };

type Props = { titulo: string; rotulo?: string; apoio?: string; trilha?: ItemTrilha[]; children?: ReactNode };

/** Abertura das páginas internas: trilha, rótulo, H1, texto de apoio e o que vier junto (botão, ilustração). */
export function CabecalhoPagina({ titulo, rotulo, apoio, trilha, children }: Props) {
  return (
    <div className="cabecalho">
      <div className="cabecalho__miolo">
        {trilha && (
          <nav className="trilha" aria-label="Trilha">
            <ol>
              {trilha.map((item) => (
                <li key={item.rotulo}>
                  {item.href ? (
                    <Link href={item.href}>{item.rotulo}</Link>
                  ) : (
                    <span aria-current="page">{item.rotulo}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {rotulo && <Rotulo>{rotulo}</Rotulo>}
        <h1 className="cabecalho__titulo">{titulo}</h1>
        {apoio && <p className="cabecalho__apoio">{apoio}</p>}
        {children}
      </div>
    </div>
  );
}
