"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { menu } from "@/content/navegacao";

/** Menu do celular. Funciona sem JavaScript (<details>); com ele, fecha no Esc, no clique fora e no link. */
export function MenuCelular() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const menuEl = ref.current;
    if (!menuEl) return;
    const fechar = (devolverFoco: boolean) => {
      if (!menuEl.open) return;
      menuEl.open = false;
      if (devolverFoco) menuEl.querySelector("summary")?.focus();
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar(true);
    };
    const aoClicarFora = (e: MouseEvent) => {
      if (!menuEl.contains(e.target as Node)) fechar(false);
    };
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("click", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("click", aoClicarFora);
    };
  }, []);

  return (
    <details className="topo__menu" ref={ref}>
      <summary className="topo__icone" aria-label="Menu">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </summary>
      <nav className="topo__painel" aria-label="Menu">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
          >
            {item.rotulo}
          </Link>
        ))}
      </nav>
    </details>
  );
}
