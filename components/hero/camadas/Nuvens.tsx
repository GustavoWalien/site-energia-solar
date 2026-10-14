const NUVEM =
  "M26 82 C8 82 2 64 14 56 C10 40 28 30 42 38 C46 18 70 10 86 22 C98 6 128 6 138 24 C156 16 178 28 174 46 C192 48 198 68 186 78 C182 82 178 82 172 82 Z";

/** Nuvens fofas, com um tom quente no nascer do sol (--quente). */
export function Nuvens() {
  return (
    <div className="hero__nuvens" id="hero-nuvens" aria-hidden="true">
      {(["n1", "n2", "n3"] as const).map((n) => (
        <svg key={n} className={`hero__nuvem hero__nuvem--${n}`} viewBox="-6 -6 212 100">
          <path d={NUVEM} fill="#FFFFFF" />
          <path className="hero__nuvem-quente" d={NUVEM} fill="#FFCFAE" />
          <path
            d="M12 64 C40 76 90 70 120 76 C150 82 172 72 192 64 C194 76 186 82 172 82 L26 82 C14 82 8 74 12 64 Z"
            fill="#D7ECFA"
          />
          <path d={NUVEM} fill="none" stroke="#2E6FA3" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}
