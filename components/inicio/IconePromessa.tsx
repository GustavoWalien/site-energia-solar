import type { ReactNode } from "react";
import type { IconePromessa as Nome } from "@/content/tipos";

const DESENHOS: Record<Nome, ReactNode> = {
  atendimento: (
    <>
      <path
        d="M12 18 H68 Q72 18 72 22 V50 Q72 54 68 54 H34 L22 66 V54 H12 Q8 54 8 50 V22 Q8 18 12 18 Z"
        fill="#FFF3DC"
      />
      <path
        d="M40 46 C30 38 28 34 30 30 C32 26 38 26 40 31 C42 26 48 26 50 30 C52 34 50 38 40 46 Z"
        fill="#E2683C"
      />
    </>
  ),
  telhado: (
    <>
      <path d="M10 46 L40 20 L70 46 Z" fill="#E2683C" />
      <rect x="18" y="46" width="44" height="22" fill="#FFF3DC" />
      <path d="M28 56 L36 63 L52 49" strokeWidth="5" />
    </>
  ),
  proposta: (
    <>
      <path d="M18 8 H50 L62 20 V72 H18 Z" fill="#FAFAF5" />
      <path d="M50 8 V20 H62" />
      <path d="M26 32 H54 M26 42 H54 M26 52 H44" />
      <circle cx="56" cy="60" r="10" fill="#F5B800" />
      <path d="M51 60 L55 64 L61 56" />
    </>
  ),
  protocolo: (
    <>
      <rect x="16" y="14" width="48" height="58" rx="6" fill="#FFF3DC" />
      <rect x="28" y="8" width="24" height="12" rx="4" fill="#3FA2DB" />
      <path d="M26 34 H54 M26 44 H54" />
      <circle cx="50" cy="58" r="8" fill="#F5B800" />
      <path d="M46 58 L49 61 L54 55" />
    </>
  ),
};

/** Ilustração de cada promessa, no traço do hero. Decorativa. */
export function IconePromessa({ nome, className }: { nome: Nome; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {DESENHOS[nome]}
      </g>
    </svg>
  );
}
