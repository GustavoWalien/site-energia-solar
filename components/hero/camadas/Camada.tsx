import type { ReactNode } from "react";
import { AJUSTE, VIEWBOX } from "../geometria";

type Props = { id: string; paralaxe?: number; children: ReactNode };

/** Uma camada da cena em SVG, no enquadramento da paisagem. Com paralaxe, o motor a desloca no scroll. */
export function Camada({ id, paralaxe, children }: Props) {
  return (
    <svg
      id={id}
      className={paralaxe === undefined ? "hero__camada" : "hero__camada hero__paisagem"}
      data-paralaxe={paralaxe}
      viewBox={VIEWBOX.paisagem}
      preserveAspectRatio={AJUSTE.paisagem}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}
