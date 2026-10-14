import type { RetratoMembro } from "@/content/tipos";

const CONTORNO = { stroke: "#0E3557", strokeWidth: 4, strokeLinejoin: "round" as const };

/** Franja de cada tipo de cabelo, por cima da cabeça. */
const FRANJA: Record<RetratoMembro["cabelo"], string> = {
  curto: "M50 64 C50 44 64 36 80 36 C98 36 110 46 110 64 C104 54 92 50 80 50 C68 50 56 54 50 64 Z",
  longo: "M50 66 C52 44 66 36 80 36 C96 36 110 44 110 66 C100 56 88 50 80 50 C70 50 58 56 50 66 Z",
  coque: "M50 62 C50 44 64 38 80 38 C96 38 110 44 110 62 C102 52 90 48 80 48 C70 48 58 52 50 62 Z",
};

type Props = { retrato: RetratoMembro; id: string; className?: string };

/** Retrato ilustrado no traço do hero (sem fotos de pessoas reais). Decorativo: o nome vem em texto ao lado. */
export function Retrato({ retrato, id, className }: Props) {
  const { pele, cabelo, corCabelo, roupa, acessorio } = retrato;
  const coberto = acessorio === "capacete" || acessorio === "bone";
  return (
    <svg className={className} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <circle cx="80" cy="80" r="74" />
        </clipPath>
      </defs>
      <circle cx="80" cy="80" r="76" fill="#D6EEFB" {...CONTORNO} />
      <g clipPath={`url(#${id})`}>
        {cabelo === "longo" && <ellipse cx="80" cy="84" rx="38" ry="44" fill={corCabelo} {...CONTORNO} />}
        {cabelo === "coque" && !coberto && <circle cx="80" cy="30" r="13" fill={corCabelo} {...CONTORNO} />}
        <path d="M22 164 C24 126 50 110 80 110 C110 110 136 126 138 164 Z" fill={roupa} {...CONTORNO} />
        <path d="M70 92 H90 V114 C84 120 76 120 70 114 Z" fill={pele} {...CONTORNO} />
        <ellipse cx="80" cy="70" rx="30" ry="34" fill={pele} {...CONTORNO} />
        {!coberto && <path d={FRANJA[cabelo]} fill={corCabelo} {...CONTORNO} />}
        <circle cx="69" cy="74" r="3.5" fill="#0E3557" />
        <circle cx="91" cy="74" r="3.5" fill="#0E3557" />
        <circle cx="62" cy="85" r="5" fill="#F08C7A" opacity="0.45" />
        <circle cx="98" cy="85" r="5" fill="#F08C7A" opacity="0.45" />
        <path d="M71 88 Q80 95 89 88" fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinecap="round" />
        {acessorio === "oculos" && (
          <g fill="none" stroke="#0E3557" strokeWidth="3">
            <circle cx="69" cy="74" r="9" />
            <circle cx="91" cy="74" r="9" />
            <path d="M78 74 H82" />
          </g>
        )}
        {acessorio === "capacete" && (
          <g fill="#F5B800" {...CONTORNO}>
            <path d="M48 62 C48 36 62 28 80 28 C98 28 112 36 112 62 Z" />
            <rect x="42" y="58" width="76" height="9" rx="4" />
          </g>
        )}
        {acessorio === "bone" && (
          <g fill="#E2683C" {...CONTORNO}>
            <path d="M50 58 C50 38 64 32 80 32 C96 32 110 38 110 58 Z" />
            <path d="M104 56 C116 55 126 58 129 63 L104 63 Z" />
          </g>
        )}
      </g>
    </svg>
  );
}
