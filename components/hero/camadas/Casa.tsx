import { PLACAS, arred } from "../geometria";

/** As oito placas do telhado. O motor acende cada uma, com um pulinho, o reflexo e a faísca. */
function Placas() {
  return (
    <g id="hero-placas">
      {PLACAS.map((p) => (
        <g key={p.id} className="hero__placa" data-placa={p.ordem}>
          <polygon points={p.quad} fill="#1D4E89" stroke="none" />
          <path d={p.celulas} stroke="#3A6CA8" strokeWidth="2.5" fill="none" />
          <g className="hero__placa-luz" data-placa-luz={p.ordem} opacity="0">
            <polygon points={p.quad} fill="#4FB6EE" stroke="none" />
            <path d={p.celulas} stroke="#A8E2FC" strokeWidth="2.5" fill="none" />
          </g>
          <g clipPath={`url(#hero-${p.id})`}>
            <polygon
              data-placa-faixa={p.ordem}
              points={p.faixa}
              transform={`translate(${arred(-0.85 * p.largura)} 0)`}
              fill="#F2FBFF"
              stroke="none"
              opacity="0.9"
            />
          </g>
          <polygon points={p.quad} fill="none" strokeWidth="4" />
        </g>
      ))}
      {PLACAS.map((p) => (
        <use
          key={p.id}
          data-placa-faisca={p.ordem}
          href="#hero-estrelinha"
          transform={`translate(${p.fx} ${p.fy}) scale(0.4)`}
          fill="#FFF6D6"
          strokeWidth="3"
          opacity="0"
        />
      ))}
    </g>
  );
}

/** A casa com as placas no telhado, as janelas que acendem e o ar-condicionado ligado. */
export function Casa() {
  return (
    <g id="hero-casa">
      <polygon points="1392,604 1432,496 1472,580 1472,700 1392,724" fill="#F6DDB0" />
      <rect x="1108" y="604" width="284" height="120" fill="#FFF3DC" />
      <path d="M1112 619 H1388" stroke="#EAD3AA" strokeWidth="10" />
      <rect x="1104" y="708" width="292" height="16" fill="#EBD3A6" />
      <polygon points="1430,494 1452,494 1496,586 1474,586" fill="#C4502A" />
      <polygon points="1090,606 1410,606 1450,498 1130,498" fill="#E2683C" />
      <path d="M1100 597 H1414 M1134 503 H1446" stroke="#C4502A" strokeWidth="3" fill="none" />
      <Placas />
      <rect x="1084" y="602" width="332" height="12" rx="4" fill="#C4502A" />
      <g fill="#3FA2DB" strokeWidth="3.5">
        <rect x="1118" y="630" width="14" height="52" rx="3" />
        <rect x="1192" y="630" width="14" height="52" rx="3" />
        <rect x="1286" y="630" width="14" height="52" rx="3" />
        <rect x="1360" y="630" width="14" height="52" rx="3" />
      </g>
      <g fill="#2C4A6B">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <g id="hero-janelas" opacity="0" fill="#FFD45C" stroke="none">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <path d="M1162 632 V680 M1134 656 H1190 M1330 632 V680 M1302 656 H1358" stroke="#FFF3DC" strokeWidth="4" fill="none" />
      <g fill="none">
        <rect x="1132" y="630" width="60" height="52" rx="5" />
        <rect x="1300" y="630" width="60" height="52" rx="5" />
      </g>
      <g fill="#EBD3A6" strokeWidth="3.5">
        <rect x="1124" y="681" width="76" height="9" rx="3" />
        <rect x="1292" y="681" width="76" height="9" rx="3" />
      </g>
      <rect x="1226" y="640" width="48" height="84" rx="8" fill="#8B5A3C" />
      <path d="M1236 652 h28 v26 h-28z M1236 688 h28 v26 h-28z" fill="none" stroke="#6E4630" strokeWidth="3" />
      <circle cx="1265" cy="684" r="4" fill="#FFD23F" strokeWidth="2.5" />
      <rect x="1216" y="720" width="68" height="8" rx="3" fill="#E2CDA3" />
      <polygon points="1406,618 1450,605 1450,635 1406,648" fill="#F4F7FA" strokeWidth="4" />
      <path d="M1412 627 L1444 617 M1412 634 L1444 624 M1412 641 L1444 631" stroke="#A9B6C2" strokeWidth="2.5" />
      <g id="hero-vento" opacity="0" fill="none" stroke="#5CC2F2" strokeWidth="4">
        <path className="hero__vento" d="M1458 612 C1474 606 1486 614 1502 606" />
        <path className="hero__vento" d="M1458 626 C1476 620 1488 630 1508 622" />
        <path className="hero__vento" d="M1458 640 C1472 636 1484 644 1498 638" />
      </g>
      <g fill="#0E3557" strokeWidth="9">
        <circle cx="1150" cy="716" r="13" />
        <circle cx="1166" cy="709" r="16" />
        <circle cx="1182" cy="716" r="12" />
        <circle cx="1374" cy="716" r="12" />
        <circle cx="1390" cy="709" r="15" />
        <circle cx="1406" cy="716" r="11" />
      </g>
      <g fill="#4FA36B" stroke="none">
        <circle cx="1150" cy="716" r="13" />
        <circle cx="1166" cy="709" r="16" />
        <circle cx="1182" cy="716" r="12" />
        <circle cx="1374" cy="716" r="12" />
        <circle cx="1390" cy="709" r="15" />
        <circle cx="1406" cy="716" r="11" />
      </g>
      <g fill="#FFFFFF" stroke="none">
        <circle cx="1158" cy="704" r="2.6" />
        <circle cx="1172" cy="714" r="2.6" />
        <circle cx="1144" cy="716" r="2.2" />
        <circle cx="1384" cy="704" r="2.6" />
        <circle cx="1398" cy="714" r="2.6" />
      </g>
    </g>
  );
}
