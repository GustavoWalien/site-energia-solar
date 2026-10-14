import type { CSSProperties } from "react";
import { PETALAS } from "../geometria";
import { COPA, bolinhas, type Circulos } from "./formas";

const SOMBRA: Circulos = [
  [826, 604, 34],
  [868, 618, 34],
  [930, 622, 34],
  [846, 562, 16],
  [890, 524, 14],
];
const LUZ: Circulos = [
  [960, 468, 24],
  [1006, 528, 20],
  [1032, 570, 12],
  [916, 460, 14],
];
const BRILHOS: Circulos = [
  [884, 520, 7],
  [930, 498, 6],
  [962, 540, 7],
  [858, 552, 5],
  [904, 470, 6],
  [1000, 556, 5],
  [920, 546, 4.5],
  [976, 500, 4.5],
  [1014, 586, 4],
];
const MIOLOS: Circulos = [
  [872, 584, 4],
  [944, 572, 4],
  [836, 610, 3.5],
  [990, 578, 3.5],
];

/** O ipê-amarelo florido, com as flores caindo. Elemento de Cuiabá (e o nome da marca). */
export function Ipe() {
  return (
    <g id="hero-ipe">
      <use href="#hero-galhos" stroke="#0E3557" strokeWidth="20" />
      <use href="#hero-galhos" stroke="#8A5A3A" strokeWidth="11" />
      <g fill="#0E3557" strokeWidth="10">
        {bolinhas(COPA)}
      </g>
      <g stroke="none">
        <g fill="#F5B800">{bolinhas(COPA)}</g>
        <g clipPath="url(#hero-copa)">
          <g fill="#E39E00">{bolinhas(SOMBRA)}</g>
          <g fill="#FFD65A">{bolinhas(LUZ)}</g>
        </g>
        <g fill="#FFF0A8">{bolinhas(BRILHOS)}</g>
        <g fill="#F08C1A">{bolinhas(MIOLOS)}</g>
      </g>
      <g fill="#F5B800" strokeWidth="1.5">
        {PETALAS.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path
              className="hero__petala"
              d="M0 0 C5 -6 11 -2 9 4 C7 9 1 8 0 0Z"
              style={{ "--d": `${p.duracao}s`, "--atraso": `${p.atraso}s`, "--vx": `${p.vx}px` } as CSSProperties}
            />
          </g>
        ))}
      </g>
    </g>
  );
}
