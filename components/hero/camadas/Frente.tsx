import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Frente: o capim que entra pelas bordas, com uma flor de ipê. */
export function Frente() {
  return (
    <Camada id="hero-frente" paralaxe={PARALAXE.frente}>
      <g stroke="#0E3557" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M110 940 C116 870 104 828 76 796 C120 818 146 866 148 940 Z" fill="#3E9A5C" />
        <path d="M146 940 C152 862 166 812 204 776 C190 826 182 878 184 940 Z" fill="#4CAF6A" />
        <path d="M184 940 C190 886 214 852 252 834 C232 862 222 894 222 940 Z" fill="#3E9A5C" />
        <path d="M222 940 C228 898 248 878 282 866 C262 888 256 910 258 940 Z" fill="#4CAF6A" />
        <path d="M166 940 C168 880 176 846 192 818" fill="none" />
        <g transform="translate(194 812)">
          <g fill="#F5B800">
            <ellipse cx="0" cy="-11" rx="6" ry="10" />
            <ellipse cx="0" cy="11" rx="6" ry="10" />
            <ellipse cx="-11" cy="0" rx="10" ry="6" />
            <ellipse cx="11" cy="0" rx="10" ry="6" />
          </g>
          <circle r="6" fill="#0E3557" />
        </g>
        <path d="M1600 940 C1594 870 1606 828 1634 796 C1590 818 1564 866 1562 940 Z" fill="#3E9A5C" />
        <path d="M1564 940 C1558 862 1544 812 1506 776 C1520 826 1528 878 1526 940 Z" fill="#4CAF6A" />
        <path d="M1526 940 C1520 886 1496 852 1458 834 C1478 862 1488 894 1488 940 Z" fill="#3E9A5C" />
        <path d="M1488 940 C1482 898 1462 878 1428 866 C1448 888 1454 910 1452 940 Z" fill="#4CAF6A" />
      </g>
    </Camada>
  );
}
