import type { ReactNode } from "react";
import { paginas } from "@/content/paginas";

/** Caixa "Na prática" dos artigos: a dica concreta no meio do texto. */
export function NaPratica({ children }: { children: ReactNode }) {
  return (
    <aside className="na-pratica">
      <p className="na-pratica__rotulo">{paginas.blog.naPratica}</p>
      {children}
    </aside>
  );
}
