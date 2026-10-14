import type { ReactNode } from "react";
import type { IconeServico as Nome } from "@/content/tipos";

const DESENHOS: Record<Nome, ReactNode> = {
  casa: (
    <>
      <circle cx="98" cy="20" r="11" fill="#FFD23F" />
      <path d="M10 80 H110" />
      <rect x="28" y="46" width="52" height="34" fill="#FFF3DC" />
      <path d="M20 48 L54 20 L88 48 Z" fill="#E2683C" />
      <path d="M58 27 L72 38 L66 43 L52 32 Z" fill="#4FB6EE" />
      <rect x="46" y="58" width="16" height="22" fill="#8B5A3C" />
      <rect x="33" y="54" width="9" height="9" fill="#3FA2DB" />
    </>
  ),
  empresa: (
    <>
      <path d="M10 80 H110" />
      <path d="M28 34 L36 18 H58 L50 34 Z M62 34 L70 18 H92 L84 34 Z" fill="#4FB6EE" />
      <rect x="22" y="34" width="76" height="46" fill="#FFF3DC" />
      <path d="M18 34 H102 L96 46 H24 Z" fill="#3FA2DB" />
      <path d="M38 34 L36 46 M56 34 L55 46 M74 34 L74 46 M90 34 L91 46" />
      <rect x="30" y="54" width="22" height="26" fill="#2C4A6B" />
      <rect x="60" y="54" width="30" height="16" fill="#3FA2DB" />
    </>
  ),
  campo: (
    <>
      <circle cx="22" cy="20" r="10" fill="#FFD23F" />
      <path d="M6 80 H114" />
      <path d="M60 80 V46 Q60 30 82 30 Q104 30 104 46 V80 Z" fill="#E2683C" />
      <rect x="74" y="56" width="16" height="24" fill="#8B5A3C" />
      <path d="M10 66 L22 50 H48 L36 66 Z" fill="#4FB6EE" />
      <path d="M22 66 V80 M34 66 V80" />
      <path d="M40 80 l4 -8 l4 7 l4 -9 l4 8" stroke="#3B8A55" />
    </>
  ),
  limpeza: (
    <>
      <path d="M8 80 H112" />
      <path d="M18 64 L44 28 H96 L70 64 Z" fill="#4FB6EE" />
      <path d="M31 46 H83 M70 28 L44 64" />
      <path d="M44 64 V80 M70 64 V80" />
      <path d="M100 44 C100 44 94 52 94 56 A6 6 0 0 0 106 56 C106 52 100 44 100 44 Z" fill="#D6EEFB" />
      <path d="M84 12 L104 32" />
      <path d="M98 38 L110 26" strokeWidth="6" />
    </>
  ),
};

/** Ilustração pequena de cada serviço, no traço do hero. Decorativa. */
export function IconeServico({ nome, className }: { nome: Nome; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {DESENHOS[nome]}
      </g>
    </svg>
  );
}
