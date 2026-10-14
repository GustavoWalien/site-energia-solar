import type { ReactNode } from "react";
import type { Capa as Nome } from "@/content/tipos";

const CONTORNO = { stroke: "#0E3557", strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const DESENHOS: Record<Nome, ReactNode> = {
  // a casa com placas, o poste e o fio com a etiqueta do Fio B de 2026
  fiob: (
    <>
      <rect width="600" height="340" fill="#D6EEFB" />
      <circle cx="510" cy="78" r="42" fill="#FFD23F" {...CONTORNO} />
      <path d="M0 270 H600 V340 H0 Z" fill="#78BE8C" {...CONTORNO} />
      <rect x="90" y="172" width="180" height="98" fill="#FFF3DC" {...CONTORNO} />
      <path d="M70 176 L180 96 L290 176 Z" fill="#E2683C" {...CONTORNO} />
      <path d="M195 112 L245 148 L233 160 L183 124 Z" fill="#4FB6EE" {...CONTORNO} />
      <rect x="160" y="210" width="34" height="60" fill="#8B5A3C" {...CONTORNO} />
      <rect x="110" y="200" width="32" height="28" fill="#3FA2DB" {...CONTORNO} />
      <rect x="430" y="140" width="14" height="130" fill="#C9A879" {...CONTORNO} />
      <path d="M408 152 H466" fill="none" {...CONTORNO} />
      <path d="M270 192 C330 214 380 162 437 152" fill="none" stroke="#0E3557" strokeWidth="4" />
      <g transform="translate(330 214)">
        <rect x="-46" y="-23" width="92" height="46" rx="23" fill="#F5B800" {...CONTORNO} />
        <text y="9" textAnchor="middle" fontSize="26" fontWeight="800" fill="#0E3557" fontFamily="sans-serif">
          60%
        </text>
      </g>
    </>
  ),
  // céu enfumaçado, sol abafado e uma placa com manchas de poeira e fuligem
  seca: (
    <>
      <rect width="600" height="340" fill="#F6D9A8" />
      <ellipse cx="150" cy="70" rx="160" ry="40" fill="#C9B79C" opacity="0.7" />
      <ellipse cx="430" cy="112" rx="190" ry="45" fill="#BFAE95" opacity="0.6" />
      <circle cx="470" cy="70" r="40" fill="#F5B800" {...CONTORNO} />
      <path d="M0 262 H600 V340 H0 Z" fill="#D9B77A" {...CONTORNO} />
      <path d="M40 262 C30 222 70 212 60 172 C50 142 90 122 80 92" fill="none" stroke="#7A6A55" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
      <path d="M200 250 V278 M340 250 V278" fill="none" {...CONTORNO} strokeWidth="6" />
      <path d="M140 250 L220 140 H460 L380 250 Z" fill="#4FB6EE" {...CONTORNO} />
      <path d="M180 195 H420 M340 140 L260 250" fill="none" stroke="#0E3557" strokeWidth="3" />
      <g fill="#8C7A5B" opacity="0.55">
        <circle cx="250" cy="170" r="14" />
        <circle cx="330" cy="210" r="18" />
        <circle cx="400" cy="160" r="11" />
        <circle cx="215" cy="225" r="10" />
      </g>
    </>
  ),
  // a casa, o medidor e as setas de ida e volta da rede, com a moeda de kWh
  creditos: (
    <>
      <rect width="600" height="340" fill="#D6EEFB" />
      <path d="M0 280 H600 V340 H0 Z" fill="#78BE8C" {...CONTORNO} />
      <rect x="60" y="190" width="140" height="90" fill="#FFF3DC" {...CONTORNO} />
      <path d="M44 194 L130 128 L216 194 Z" fill="#E2683C" {...CONTORNO} />
      <path d="M140 140 L178 168 L168 178 L130 150 Z" fill="#4FB6EE" {...CONTORNO} />
      <rect x="268" y="160" width="74" height="92" rx="12" fill="#F2F5F8" {...CONTORNO} />
      <circle cx="305" cy="200" r="22" fill="#FAFAF5" {...CONTORNO} />
      <path d="M305 200 V184" fill="none" stroke="#E2683C" strokeWidth="5" strokeLinecap="round" />
      <rect x="468" y="120" width="14" height="160" fill="#C9A879" {...CONTORNO} />
      <path d="M220 150 C270 100 400 100 450 140" fill="none" stroke="#F5B800" strokeWidth="9" strokeLinecap="round" />
      <path d="M440 122 L462 150 L432 154 Z" fill="#F5B800" {...CONTORNO} strokeWidth="3" />
      <path d="M450 290 C400 320 270 320 220 290" fill="none" stroke="#3FA2DB" strokeWidth="9" strokeLinecap="round" />
      <path d="M232 276 L208 292 L236 306 Z" fill="#3FA2DB" {...CONTORNO} strokeWidth="3" />
      <g transform="translate(520 70)">
        <circle r="40" fill="#F5B800" {...CONTORNO} />
        <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0E3557" fontFamily="sans-serif">
          kWh
        </text>
      </g>
    </>
  ),
};

/** Capa ilustrada de um artigo, no traço do hero. Decorativa: o título vem em texto ao lado. */
export function Capa({ nome, className }: { nome: Nome; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 340" aria-hidden="true" focusable="false">
      {DESENHOS[nome]}
    </svg>
  );
}
