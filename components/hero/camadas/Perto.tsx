import { PARALAXE, PLACAS } from "../geometria";
import { Camada } from "./Camada";
import { Casa } from "./Casa";
import { COPA, bolinhas, type Circulos } from "./formas";
import { Ipe } from "./Ipe";

/** O tapete amarelo de flores caídas embaixo do ipê. */
const FLORES_CAIDAS: Circulos = [
  [862, 728, 5],
  [884, 734, 4],
  [902, 726, 5],
  [944, 732, 5],
  [968, 726, 4],
  [988, 734, 5],
  [846, 736, 3.5],
  [1004, 728, 3.5],
  [926, 738, 4],
];

/** Perto: o chão, o ipê, a casa, o relógio de luz e o fio com a energia correndo. */
export function Perto() {
  return (
    <Camada id="hero-perto" paralaxe={PARALAXE.perto}>
      <defs>
        <clipPath id="hero-copa">{bolinhas(COPA)}</clipPath>
        <path
          id="hero-galhos"
          fill="none"
          d="M920 722 C916 690 926 662 914 628 C908 610 912 596 906 578 M914 640 C896 622 874 610 852 600 M916 630 C940 612 962 600 990 590 M908 596 C900 576 902 560 896 546 M912 606 C930 590 944 572 950 554"
        />
        <path
          id="hero-estrelinha"
          d="M0 -16 C2 -4 4 -2 16 0 C4 2 2 4 0 16 C-2 4 -4 2 -16 0 C-4 -2 -2 -4 0 -16Z"
        />
        {PLACAS.map((p) => (
          <clipPath key={p.id} id={`hero-${p.id}`}>
            <polygon points={p.quad} />
          </clipPath>
        ))}
      </defs>
      <g stroke="#0E3557" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M-40 716 C180 700 400 712 620 706 C860 700 1060 694 1300 700 C1460 704 1560 700 1660 696 L1660 960 L-40 960Z"
          fill="#5DB574"
        />
        <path
          d="M-40 828 C300 808 700 820 1000 814 C1300 808 1500 820 1660 814 L1660 960 L-40 960Z"
          fill="#56AE6D"
          stroke="none"
        />
        <g fill="none" stroke="#3B8A55" strokeWidth="4">
          <path d="M120 772 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M430 812 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M690 764 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M980 852 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M1380 790 l8 -14 l6 12 l8 -16 l6 14" />
          <path d="M560 870 l8 -14 l6 12 l8 -16 l6 14" />
        </g>
        <ellipse id="hero-sombra-ipe" cx="920" cy="724" rx="70" ry="10" fill="#4A9D62" stroke="none" />
        <ellipse id="hero-sombra-casa" cx="1290" cy="728" rx="230" ry="12" fill="#4A9D62" stroke="none" />
        <path
          d="M1228 726 C1226 760 1196 790 1160 818 C1120 850 1096 880 1084 930 L1300 930 C1300 884 1310 846 1296 806 C1286 776 1276 750 1274 726 Z"
          fill="#EFCF95"
        />
        <g fill="#DDB677" stroke="none">
          <ellipse cx="1206" cy="826" rx="11" ry="5" />
          <ellipse cx="1262" cy="866" rx="13" ry="6" />
          <ellipse cx="1150" cy="892" rx="10" ry="5" />
          <ellipse cx="1272" cy="786" rx="8" ry="4" />
          <ellipse cx="1240" cy="756" rx="7" ry="3" />
        </g>
        <g fill="#F5B800" stroke="none">
          {bolinhas(FLORES_CAIDAS)}
        </g>
        <Ipe />
        <rect x="1050" y="640" width="16" height="84" rx="4" fill="#C9A879" />
        <path d="M1026 606 Q1058 584 1090 606 Z" fill="#9AA8B5" />
        <rect x="1032" y="602" width="52" height="50" rx="10" fill="#F2F5F8" />
        <circle cx="1058" cy="626" r="15" fill="#FFFFFF" strokeWidth="3.5" />
        <path id="hero-ponteiro" d="M1058 626 V614" stroke="#E2683C" strokeWidth="4" />
        <circle cx="1058" cy="626" r="3" fill="#0E3557" stroke="none" />
        <Casa />
        <path d="M1114 612 V694 H1066" fill="none" strokeWidth="9" />
        <path d="M1114 612 V694 H1066" fill="none" stroke="#9AA8B5" strokeWidth="4" />
        <path
          id="hero-fluxo"
          className="hero__fluxo"
          d="M1114 612 V694 H1058 V652"
          fill="none"
          stroke="#FFD23F"
          strokeWidth="7"
          opacity="0"
        />
      </g>
    </Camada>
  );
}
