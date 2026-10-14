/** Mapa ilustrado de Cuiabá: ruas, o rio Cuiabá e um pino. Decorativo (a legenda vem em texto). */
export function MapaDesenhado({ className }: { className?: string }) {
  const RIO = "M-20 260 C80 230 140 300 240 270 C340 240 380 330 470 300 C540 280 580 320 620 300";
  return (
    <svg className={className} viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect width="600" height="400" fill="#E6F2DF" />
      <g fill="#CFE6C4">
        <circle cx="90" cy="70" r="60" />
        <circle cx="520" cy="330" r="80" />
        <circle cx="470" cy="60" r="40" />
      </g>
      <g fill="none" stroke="#FAFAF5" strokeWidth="14" strokeLinecap="round">
        <path d="M0 150 C120 140 220 170 320 160 C420 150 500 120 600 130" />
        <path d="M180 0 C190 120 170 260 200 400" />
        <path d="M380 0 C370 140 400 260 390 400" />
        <path d="M0 340 C150 330 300 360 600 330" />
      </g>
      <path d={RIO} fill="none" stroke="#0E3557" strokeWidth="26" strokeLinecap="round" />
      <path d={RIO} fill="none" stroke="#3FA2DB" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="300" cy="182" rx="16" ry="5" fill="#0E3557" opacity="0.2" />
      <g transform="translate(300 178)">
        <path
          d="M0 0 C-14 -18 -24 -30 -24 -44 A24 24 0 0 1 24 -44 C24 -30 14 -18 0 0 Z"
          fill="#F5B800"
          stroke="#0E3557"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cy="-44" r="9" fill="#0E3557" />
      </g>
    </svg>
  );
}
