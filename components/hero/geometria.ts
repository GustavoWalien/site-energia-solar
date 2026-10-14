import type { Trecho } from "@/content/tipos";

export type Ponto = [number, number];
export type Orientacao = "paisagem" | "retrato";
type Curva = [Ponto, Ponto, Ponto];

/** Enquadramento da cena. No retrato, a câmera foca a casa e o ipê. */
export const VIEWBOX: Record<Orientacao, string> = { paisagem: "0 0 1600 900", retrato: "780 300 750 600" };
/** Na paisagem, a cena fica ancorada à direita, para a casa nunca sair da tela. */
export const AJUSTE: Record<Orientacao, string> = { paisagem: "xMaxYMax slice", retrato: "xMidYMax meet" };

/** Caminho do sol: início, controle e fim de uma curva quadrática. No retrato, o sol termina ao lado do texto. */
export const ARCOS: Record<Orientacao, Curva> = {
  paisagem: [
    [1530, 780],
    [1440, 170],
    [1150, 225],
  ],
  retrato: [
    [1600, 820],
    [1540, 280],
    [1360, 250],
  ],
};

/** Faixas de texto: [entra, sai] no progresso do hero (madrugada, manhã e meio-dia). */
export const FAIXAS: readonly [number, number][] = [
  [0, 0.24],
  [0.36, 0.64],
  [0.72, 1],
];

/** Quanto cada camada da paisagem se desloca no scroll. */
export const PARALAXE = { longe: 0.15, meio: 0.35, perto: 0.6, frente: 1 } as const;

/** Quantos pedaços do caminho do sol o motor guarda. */
export const AMOSTRAS = 240;

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Passagem suave de 0 a 1 entre a e b (smoothstep). */
export function suave(p: number, a: number, b: number): number {
  const t = clamp((p - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Arredonda para uma casa decimal, para o SVG sair curto. */
export const arred = (n: number) => Math.round(n * 10) / 10;
const xy = ([x, y]: Ponto) => `${arred(x)},${arred(y)}`;

export function dDoArco([a, c, b]: Curva): string {
  return `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
}

function naCurva([a, c, b]: Curva, t: number): Ponto {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

/** n + 1 pontos do caminho, igualmente espaçados pelo comprimento (como o getPointAtLength do navegador). */
export function amostrarArco(arco: Curva, n = AMOSTRAS): Ponto[] {
  const FINO = 2000;
  const pontos: Ponto[] = [];
  const acumulado: number[] = [];
  for (let i = 0; i <= FINO; i++) {
    const ponto = naCurva(arco, i / FINO);
    const anterior = pontos[i - 1];
    acumulado.push(anterior ? acumulado[i - 1] + Math.hypot(ponto[0] - anterior[0], ponto[1] - anterior[1]) : 0);
    pontos.push(ponto);
  }
  const total = acumulado[FINO];
  const saida: Ponto[] = [];
  let j = 0;
  for (let k = 0; k <= n; k++) {
    const alvo = (total * k) / n;
    while (j < FINO - 1 && acumulado[j + 1] < alvo) j++;
    const f = clamp((alvo - acumulado[j]) / (acumulado[j + 1] - acumulado[j] || 1), 0, 1);
    const [x0, y0] = pontos[j];
    const [x1, y1] = pontos[j + 1];
    saida.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]);
  }
  return saida;
}

/** Minutos do relógio no ponto t do caminho: 05:40 até o sol aparecer (t = 0,2), depois de 06:00 a 12:00. */
export function minutosDoSol(t: number): number {
  return t <= 0.2 ? 340 + (t / 0.2) * 20 : 360 + ((t - 0.2) / 0.8) * 360;
}
export const tDosMinutos = (m: number) => 0.2 + ((m - 360) / 360) * 0.8;
export function relogio(t: number): string {
  const m = Math.round(minutosDoSol(t));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Onde o sol está no caminho (0 a 1): sobe rápido no começo e desacelera até o meio-dia. */
export function solNoCaminho(p: number): number {
  return 1 - Math.pow(1 - clamp(p / 0.94, 0, 1), 1.9);
}

export type MarcaDeHora = { texto: string; t: number; x: number; y: number };

/** Marcas "07:00" e "09:00" ao lado do caminho, a 70 unidades da curva, que aparecem depois que o sol passa. */
export function marcasDeHora(amostras: Ponto[]): MarcaDeHora[] {
  const n = amostras.length - 1;
  return (
    [
      [420, "07:00"],
      [540, "09:00"],
    ] as const
  ).map(([minutos, texto]) => {
    const t = tDosMinutos(minutos);
    const i = Math.round(t * n);
    const [x, y] = amostras[i];
    const [x2, y2] = amostras[Math.min(n, i + 1)];
    const L = Math.hypot(x2 - x, y2 - y) || 1;
    return { texto, t, x: arred(x - ((y2 - y) / L) * 70), y: arred(y + ((x2 - x) / L) * 70) };
  });
}

/** Opacidade da faixa i no progresso p: a primeira já começa visível e a última não sai mais. */
export function opacidadeDaFaixa(p: number, i: number): number {
  const [a, b] = FAIXAS[i];
  const r = Math.min(0.02, (b - a) / 3);
  const entra = i === 0 ? 1 : suave(p, a, a + r);
  const sai = i === FAIXAS.length - 1 ? 1 : 1 - suave(p, b - r, b);
  return entra * sai;
}

/** Montagem das palavras da faixa i (o --k do CSS), em degraus de 0,008 para escrever pouco no DOM. */
export function montagemDaFaixa(p: number, i: number): number {
  if (i === 0) return 1;
  const [a, b] = FAIXAS[i];
  const k = clamp((p - a) / Math.min(0.025, (b - a) * 0.35), 0, 1);
  return Math.round(k / 0.008) * 0.008;
}

/** Estrelas que piscam: posição em % da tela e atraso da animação. */
export const ESTRELAS = (
  [
    [16, 12, 0],
    [29, 5, -1.1],
    [61, 18, -2.3],
    [72, 7, -0.6],
    [86, 15, -1.7],
    [93, 29, -2.8],
    [7, 31, -0.9],
    [54, 34, -2],
  ] as const
).map(([x, y, atraso]) => ({ x, y, atraso }));

/** Raios do sol, longos e curtos alternados. */
export const RAIOS = Array.from({ length: 12 }, (_, i) => {
  const ponta = i % 2 ? 120 : 142;
  return { d: `M-15 -92 Q0 ${-ponta - 14} 15 -92 Z`, rotacao: i * 30 };
});

export type Placa = {
  id: string;
  /** Ordem em que a placa acende: a fileira de baixo primeiro, da esquerda para a direita. */
  ordem: number;
  quad: string;
  celulas: string;
  /** O reflexo que atravessa a placa quando ela acende. */
  faixa: string;
  cx: number;
  cy: number;
  /** Onde nasce a faísca. */
  fx: number;
  fy: number;
  largura: number;
};

/** Ponto do telhado em coordenadas (u, v) de 0 a 1. */
const noTelhado = (u: number, v: number): Ponto => [1090 + 320 * u + 40 * v, 606 - 108 * v];

function criarPlacas(): Placa[] {
  const placas: Placa[] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const u0 = 0.06 + c * 0.22 + 0.014;
      const u1 = 0.06 + (c + 1) * 0.22 - 0.014;
      const v0 = 0.14 + r * 0.38 + 0.03;
      const v1 = 0.14 + (r + 1) * 0.38 - 0.03;
      const quad = [noTelhado(u0, v0), noTelhado(u1, v0), noTelhado(u1, v1), noTelhado(u0, v1)].map(xy).join(" ");
      const [cx, cy] = noTelhado((u0 + u1) / 2, (v0 + v1) / 2);
      const linhas = [1 / 3, 2 / 3].map(
        (k) => `M${xy(noTelhado(u0 + (u1 - u0) * k, v0))} L${xy(noTelhado(u0 + (u1 - u0) * k, v1))}`,
      );
      linhas.push(`M${xy(noTelhado(u0, (v0 + v1) / 2))} L${xy(noTelhado(u1, (v0 + v1) / 2))}`);
      const h = (108 * (v1 - v0)) / 2 + 8;
      const faixa = (
        [
          [cx - 24, cy + h],
          [cx - 8, cy + h],
          [cx + 20, cy - h],
          [cx + 4, cy - h],
        ] as Ponto[]
      )
        .map(xy)
        .join(" ");
      const [fx, fy] = noTelhado(u1, v1);
      placas.push({
        id: `placa-${r}${c}`,
        ordem: (1 - r) * 4 + c,
        quad,
        celulas: linhas.join(" "),
        faixa,
        cx: arred(cx),
        cy: arred(cy),
        fx: arred(fx),
        fy: arred(fy),
        largura: arred(320 * (u1 - u0)),
      });
    }
  }
  return placas;
}

export const PLACAS = criarPlacas();

/** Flores do ipê caindo: posição inicial, duração, atraso e quanto andam para o lado. */
export const PETALAS = Array.from({ length: 12 }, (_, i) => ({
  x: 830 + ((i * 47) % 190),
  y: 480 + ((i * 29) % 110),
  duracao: arred(7 + (i % 5) * 1.3),
  atraso: arred(-i * 1.7),
  vx: (i % 2 ? 1 : -1) * (30 + ((i * 13) % 50)),
}));

export type Palavra = { i: number; partes: Trecho[] };

/** Divide o título em palavras para a montagem. A pontuação fica colada à palavra anterior e o destaque se mantém. */
export function dividirEmPalavras(titulo: Trecho[]): Palavra[] {
  const palavras: Palavra[] = [];
  let atual: Trecho[] = [];
  const fechar = () => {
    if (atual.length) palavras.push({ i: palavras.length, partes: atual });
    atual = [];
  };
  for (const trecho of titulo) {
    for (const pedaco of trecho.texto.split(/(\s+)/)) {
      if (!pedaco) continue;
      if (/^\s+$/.test(pedaco)) {
        fechar();
        continue;
      }
      atual.push(trecho.destaque ? { texto: pedaco, destaque: true } : { texto: pedaco });
    }
  }
  fechar();
  return palavras;
}

export const textoCorrido = (titulo: Trecho[]) => titulo.map((t) => t.texto).join("");
