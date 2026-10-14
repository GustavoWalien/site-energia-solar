import type { ReactNode } from "react";

/** Rótulo pequeno em mono, acima do título de uma seção. */
export function Rotulo({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={className ? `rotulo ${className}` : "rotulo"}>{children}</p>;
}
