/** Círculos [cx, cy, r] usados mais de uma vez no desenho. */
export type Circulos = readonly (readonly [number, number, number])[];

export function bolinhas(lista: Circulos) {
  return lista.map(([cx, cy, r]) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />);
}

/** A copa do ipê: o contorno, o amarelo e o recorte das luzes usam os mesmos círculos. */
export const COPA: Circulos = [
  [850, 575, 42],
  [880, 538, 44],
  [932, 518, 50],
  [986, 548, 44],
  [1012, 586, 30],
  [826, 604, 26],
  [900, 486, 36],
  [962, 488, 32],
  [950, 582, 36],
  [900, 590, 30],
];
