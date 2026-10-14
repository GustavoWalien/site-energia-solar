import { RAIOS } from "../geometria";

/** O sol: halo, raios que giram e disco. Sem rosto (decisão da spec). */
export function Sol() {
  return (
    <div className="hero__sol" id="hero-sol" aria-hidden="true">
      <svg viewBox="-220 -220 440 440">
        <g fill="#FFE9A3">
          <circle r="214" opacity=".1" />
          <circle r="168" opacity=".16" />
          <circle r="124" opacity=".24" />
        </g>
      </svg>
      <div className="hero__raios">
        <svg viewBox="-220 -220 440 440">
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
        </svg>
      </div>
      <svg viewBox="-220 -220 440 440">
        <circle r="80" fill="#FFD23F" stroke="#E08A00" strokeWidth="6" />
        <circle r="60" fill="#FFE27A" />
        <path d="M-50 -30 A58 58 0 0 1 -14 -56" fill="none" stroke="#FFF8DC" strokeWidth="10" strokeLinecap="round" />
        <circle cx="34" cy="30" r="6" fill="#FFF8DC" opacity=".8" />
      </svg>
    </div>
  );
}
