import { ESTRELAS } from "../geometria";

/** Quatro céus que se misturam (madrugada, nascer, manhã e meio-dia), com as estrelas e a lua. */
export function Ceu() {
  return (
    <>
      <div className="hero__ceu hero__ceu--madrugada" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--nascer" id="hero-ceu-nascer" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--manha" id="hero-ceu-manha" aria-hidden="true" />
      <div className="hero__ceu hero__ceu--dia" id="hero-ceu-dia" aria-hidden="true" />
      <div className="hero__noite" id="hero-noite" aria-hidden="true">
        {ESTRELAS.map((e) => (
          <svg
            key={`${e.x}-${e.y}`}
            className="hero__estrela"
            viewBox="-10 -10 20 20"
            style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${e.atraso}s` }}
          >
            <path d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z" fill="#FFF6D6" />
          </svg>
        ))}
        <svg className="hero__lua" id="hero-lua" viewBox="-40 -40 80 80">
          <path
            d="M10 -28.3 A30 30 0 1 0 10 28.3 A30.7 30.7 0 0 1 10 -28.3 Z"
            fill="#FFF3C4"
            stroke="#E6CF86"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
