import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Meio: morros com árvores do cerrado. */
export function Meio() {
  return (
    <Camada id="hero-meio" paralaxe={PARALAXE.meio}>
      <g stroke="#2E6A5C" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M-40 670 C80 652 200 650 330 660 C460 668 560 646 700 640 C840 634 940 650 1060 648 C1180 646 1290 632 1420 634 C1520 636 1580 644 1660 640 L1660 960 L-40 960Z"
          fill="#78BE8C"
        />
        <g fill="none" stroke="#5E4A3A" strokeWidth="5">
          <path d="M196 660 v-24" />
          <path d="M1556 646 v-24" />
        </g>
        <g fill="#4E9E6A">
          <circle cx="196" cy="630" r="16" />
          <circle cx="1556" cy="618" r="17" />
        </g>
      </g>
    </Camada>
  );
}
