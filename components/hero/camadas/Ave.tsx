/** O tuiuiú, ave do Pantanal, que atravessa o céu entre a madrugada e a manhã. Elemento de Cuiabá. */
export function Ave() {
  return (
    <div className="hero__ave" id="hero-ave" aria-hidden="true">
      <svg viewBox="-110 -90 240 130">
        <g transform="translate(-6 -6)">
          <path
            className="hero__asa hero__asa--longe"
            d="M0 0 C-10 -30 -30 -52 -58 -64 C-52 -56 -56 -52 -46 -48 C-50 -42 -52 -40 -42 -36 C-40 -22 -32 -8 -26 0 Z"
            fill="#DCE7EE"
            stroke="#0E3557"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        <path d="M-30 6 L-98 12 M-30 10 L-96 20" stroke="#1B2230" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path
          d="M-34 -4 C-50 -4 -56 4 -46 10 C-40 12 -34 8 -30 6 Z"
          fill="#FFFFFF"
          stroke="#0E3557"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="2" rx="38" ry="14" fill="#FFFFFF" stroke="#0E3557" strokeWidth="3" />
        <path d="M28 -2 C40 -8 52 -11 64 -11" stroke="#1B2230" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M27 -1 C31 -3 35 -4 39 -6" stroke="#E0413A" strokeWidth="12" fill="none" strokeLinecap="round" />
        <circle cx="66" cy="-12" r="8.5" fill="#1B2230" />
        <path
          d="M71 -16 C86 -18 102 -21 118 -26 C106 -14 90 -9 72 -7 Z"
          fill="#2B303B"
          stroke="#1B2230"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="68.5" cy="-14.5" r="1.8" fill="#FFFFFF" />
        <g transform="translate(6 -4)">
          <path
            className="hero__asa hero__asa--perto"
            d="M0 0 C-12 -36 -38 -64 -72 -80 C-64 -70 -68 -66 -56 -62 C-62 -56 -62 -52 -50 -48 C-54 -42 -54 -40 -44 -36 C-42 -22 -36 -8 -30 0 Z"
            fill="#FFFFFF"
            stroke="#0E3557"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
