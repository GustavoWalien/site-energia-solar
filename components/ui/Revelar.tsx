"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Marca o bloco com data-revelado quando ele entra na tela. O CSS cuida da entrada; sem JavaScript, tudo já aparece. */
export function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.revelado = "";
        observador.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ? `revelar ${className}` : "revelar"}>
      {children}
    </div>
  );
}
