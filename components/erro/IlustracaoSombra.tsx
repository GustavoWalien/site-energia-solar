import { RAIOS } from "@/components/hero/geometria";

const NUVEM =
  "M26 82 C8 82 2 64 14 56 C10 40 28 30 42 38 C46 18 70 10 86 22 C98 6 128 6 138 24 C156 16 178 28 174 46 C192 48 198 68 186 78 C182 82 178 82 172 82 Z";

/** O sol do hero escondido atrás de uma nuvem: a página "tomou sombra". Decorativa. */
export function IlustracaoSombra({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <g transform="translate(200 92) scale(0.42)">
        {RAIOS.map((r) => (
          <path
            key={r.rotacao}
            d={r.d}
            transform={`rotate(${r.rotacao})`}
            fill="#FFC21A"
            stroke="#E08A00"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        ))}
        <circle r="80" fill="#FFD23F" stroke="#E08A00" strokeWidth="6" />
        <circle r="60" fill="#FFE27A" />
      </g>
      <g transform="translate(36 96) scale(1.25)">
        <path d={NUVEM} fill="#FAFAF5" />
        <path
          d="M12 64 C40 76 90 70 120 76 C150 82 172 72 192 64 C194 76 186 82 172 82 L26 82 C14 82 8 74 12 64 Z"
          fill="#D7ECFA"
        />
        <path d={NUVEM} fill="none" stroke="#0E3557" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <ellipse cx="160" cy="226" rx="110" ry="9" fill="#0E3557" opacity="0.15" />
    </svg>
  );
}
