"use client";

import { useEffect } from "react";
import {
  AJUSTE,
  ARCOS,
  FAIXAS,
  PLACAS,
  VIEWBOX,
  amostrarArco,
  clamp,
  dDoArco,
  montagemDaFaixa,
  opacidadeDaFaixa,
  relogio,
  solNoCaminho,
  suave,
  type Orientacao,
  type Ponto,
} from "./geometria";

/** Liga o hero ao scroll. Não desenha nada: só escreve no DOM que o servidor já mandou pronto. */
export function MotorDoHero() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    const palco = document.getElementById("hero-palco");
    if (!hero || !palco) return;
    return ligar(hero, palco);
  }, []);
  return null;
}

type Estilo = "transform" | "visibility" | "pointerEvents";

function ligar(hero: HTMLElement, palco: HTMLElement): () => void {
  const pegar = <T extends Element>(seletor: string): T => {
    const el = hero.querySelector<T>(seletor);
    if (!el) throw new Error(`Hero: ${seletor} não encontrado`);
    return el;
  };
  const todos = <T extends Element>(seletor: string) => [...hero.querySelectorAll<T>(seletor)];

  const camadas = todos<SVGSVGElement>(".hero__camada");
  const paisagens = todos<SVGSVGElement>(".hero__paisagem").map((el) => ({ el, fator: Number(el.dataset.paralaxe) }));
  const sol = pegar<HTMLElement>("#hero-sol");
  const ave = pegar<HTMLElement>("#hero-ave");
  const noite = pegar<HTMLElement>("#hero-noite");
  const lua = pegar<SVGSVGElement>("#hero-lua");
  const nuvens = pegar<HTMLElement>("#hero-nuvens");
  const ceuNascer = pegar<HTMLElement>("#hero-ceu-nascer");
  const ceuManha = pegar<HTMLElement>("#hero-ceu-manha");
  const ceuDia = pegar<HTMLElement>("#hero-ceu-dia");
  const brilho = pegar<HTMLElement>("#hero-brilho-nascer");
  const sombraNoite = pegar<HTMLElement>("#hero-sombra-noite");
  const hora = pegar<HTMLElement>("#hero-hora");
  const kw = pegar<HTMLElement>("#hero-kw");
  const barra = pegar<HTMLElement>("#hero-barra");
  const dica = pegar<HTMLElement>("#hero-dica");
  const sombraIpe = pegar<SVGEllipseElement>("#hero-sombra-ipe");
  const sombraCasa = pegar<SVGEllipseElement>("#hero-sombra-casa");
  const janelas = pegar<SVGGElement>("#hero-janelas");
  const fluxo = pegar<SVGPathElement>("#hero-fluxo");
  const vento = pegar<SVGGElement>("#hero-vento");
  const ponteiro = pegar<SVGPathElement>("#hero-ponteiro");
  const mascara = pegar<SVGPathElement>("#hero-arco-mascara");
  const arcos = todos<SVGPathElement>(".hero__arco");
  const horas = todos<SVGGElement>(".hero__hora").map((g) => ({ g, t: Number(g.dataset.t) }));
  const placas = PLACAS.map((p) => ({
    ...p,
    g: pegar<SVGGElement>(`[data-placa="${p.ordem}"]`),
    luz: pegar<SVGGElement>(`[data-placa-luz="${p.ordem}"]`),
    faixa: pegar<SVGPolygonElement>(`[data-placa-faixa="${p.ordem}"]`),
    faisca: pegar<SVGUseElement>(`[data-placa-faisca="${p.ordem}"]`),
  }));
  const faixas = todos<HTMLElement>("[data-faixa]");
  const faixaFinal = faixas[faixas.length - 1];
  const topo = document.getElementById("topo");
  const flutuante = document.getElementById("whatsapp-flutuante");
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

  // escritas no DOM só quando o valor muda
  const cache = new Map<string, string | number | boolean>();
  const opacidade = (el: HTMLElement | SVGElement, v: number, chave: string) => {
    const r = Math.round(v * 1000) / 1000;
    if (cache.get(chave) === r) return;
    cache.set(chave, r);
    el.style.opacity = String(r);
  };
  const atributo = (el: Element, nome: string, v: string, chave: string) => {
    if (cache.get(chave) === v) return;
    cache.set(chave, v);
    el.setAttribute(nome, v);
  };
  const estilo = (el: HTMLElement | SVGElement, nome: Estilo, v: string, chave: string) => {
    if (cache.get(chave) === v) return;
    cache.set(chave, v);
    el.style[nome] = v;
  };

  // enquadramento: paisagem ancorada à direita (a casa nunca sai); no retrato, a câmera foca casa e ipê
  let retrato: boolean | null = null;
  let amostras: Ponto[] = [];
  let geo = { s: 1, W: 1, vx: 0, vy: 0, ox: 0, oy: 0 };
  const faixasK = faixas.map(() => -1);

  const enquadrar = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const r = W / H < 1;
    const o: Orientacao = r ? "retrato" : "paisagem";
    const [vx, vy, vw, vh] = VIEWBOX[o].split(" ").map(Number) as [number, number, number, number];
    if (r !== retrato) {
      retrato = r;
      for (const c of camadas) {
        c.setAttribute("viewBox", VIEWBOX[o]);
        c.setAttribute("preserveAspectRatio", AJUSTE[o]);
      }
      const d = dDoArco(ARCOS[o]);
      for (const a of arcos) a.setAttribute("d", d);
      mascara.setAttribute("d", d);
      amostras = amostrarArco(ARCOS[o]);
    }
    const s = r ? Math.min(W / vw, H / vh) : Math.max(W / vw, H / vh);
    geo = { s, W, vx, vy, ox: r ? (W - vw * s) / 2 : W - vw * s, oy: H - vh * s };
    sol.style.width = sol.style.height = `${440 * s}px`;
    ave.style.width = `${170 * s}px`;
    cache.clear();
    faixasK.fill(-1);
  };
  const tela = (x: number, y: number): Ponto => [geo.ox + (x - geo.vx) * geo.s, geo.oy + (y - geo.vy) * geo.s];
  const noCaminho = (t: number) => amostras[Math.round(clamp(t, 0, 1) * (amostras.length - 1))];

  let ultimoTexto = -1e9;
  const desenhar = (p: number, agora: number, forcar: boolean) => {
    // céu
    opacidade(ceuNascer, suave(p, 0.05, 0.2), "cn");
    opacidade(ceuManha, suave(p, 0.22, 0.4), "cm");
    opacidade(ceuDia, suave(p, 0.55, 0.85), "cd");
    const quente = suave(p, 0.03, 0.15) * (1 - suave(p, 0.26, 0.42));
    opacidade(brilho, quente, "bn");
    const vNoite = 1 - suave(p, 0.03, 0.24);
    opacidade(noite, vNoite, "no");
    estilo(noite, "visibility", vNoite > 0 ? "visible" : "hidden", "nv");
    estilo(lua, "transform", `translateY(${(suave(p, 0, 0.24) * 40).toFixed(1)}px)`, "lu");
    opacidade(nuvens, suave(p, 0.1, 0.28), "nu");
    const q = quente.toFixed(2);
    if (cache.get("nq") !== q) {
      cache.set("nq", q);
      nuvens.style.setProperty("--quente", q);
    }

    // sol: sobe rápido no começo e desacelera até o meio-dia
    const tSol = solNoCaminho(p);
    const [sx, sy] = noCaminho(tSol);
    const [px, py] = tela(sx, sy);
    const meio = 220 * geo.s;
    estilo(sol, "transform", `translate3d(${(px - meio).toFixed(1)}px,${(py - meio).toFixed(1)}px,0)`, "sol");
    atributo(mascara, "stroke-dashoffset", (1 - tSol).toFixed(4), "arco");
    horas.forEach((h, i) => atributo(h.g, "opacity", suave(tSol, h.t + 0.14, h.t + 0.2).toFixed(2), `h${i}`));

    // paisagem: a câmera desce até o chão e a sombra da madrugada vai embora
    const desce = 1 - suave(p, 0, 0.45);
    opacidade(sombraNoite, 1 - suave(p, 0.02, 0.3), "sn");
    paisagens.forEach((c, i) =>
      estilo(c.el, "transform", `translate3d(0,${(110 * c.fator * desce * geo.s).toFixed(1)}px,0)`, `pt${i}`),
    );

    // sombras longas de manhã, curtas ao meio-dia
    const elevacao = clamp((600 - sy) / 435, 0, 1);
    const L = 40 + (1 - elevacao) * 260;
    atributo(sombraIpe, "cx", String(Math.round(920 + clamp((920 - sx) / 300, -1, 1) * L * 0.5)), "si");
    atributo(sombraIpe, "rx", String(Math.round(46 + L * 0.3)), "sir");
    atributo(sombraCasa, "cx", String(Math.round(1290 + clamp((1290 - sx) / 300, -1, 1) * L * 0.45)), "sc");
    atributo(sombraCasa, "rx", String(Math.round(200 + L * 0.3)), "scr");

    // placas uma a uma: acendem, dão um pulinho e soltam um brilho
    let soma = 0;
    for (const pl of placas) {
      const inicio = 0.34 + pl.ordem * 0.03;
      const v = suave(p, inicio, inicio + 0.07);
      soma += v;
      const pulo = Math.sin(Math.PI * v);
      atributo(pl.luz, "opacity", v.toFixed(3), `l${pl.ordem}`);
      atributo(
        pl.g,
        "transform",
        `translate(${pl.cx} ${pl.cy}) scale(${(1 + 0.14 * pulo).toFixed(3)}) translate(${-pl.cx} ${-pl.cy})`,
        `g${pl.ordem}`,
      );
      atributo(pl.faixa, "transform", `translate(${((v - 0.5) * pl.largura * 1.7).toFixed(1)} 0)`, `x${pl.ordem}`);
      atributo(pl.faisca, "transform", `translate(${pl.fx} ${pl.fy}) scale(${(0.4 + 0.8 * pulo).toFixed(3)})`, `s${pl.ordem}`);
      atributo(pl.faisca, "opacity", pulo.toFixed(3), `o${pl.ordem}`);
    }
    const energia = soma / placas.length;
    atributo(janelas, "opacity", (suave(energia, 0.45, 0.95) * 0.92).toFixed(3), "ja");
    atributo(fluxo, "opacity", suave(energia, 0.12, 0.45).toFixed(3), "fl");
    atributo(vento, "opacity", suave(p, 0.46, 0.56).toFixed(3), "ve");
    // o relógio de luz gira ao contrário
    atributo(ponteiro, "transform", `rotate(${Math.round(-clamp((p - 0.4) / 0.6, 0, 1) * 1080)} 1058 626)`, "po");
    estilo(barra, "transform", `scaleX(${energia.toFixed(3)})`, "ba");

    // tuiuiú atravessa o céu no intervalo entre os textos
    const tv = (p - 0.22) / 0.15;
    const voa = tv > 0 && tv < 1;
    estilo(ave, "visibility", voa ? "visible" : "hidden", "av");
    if (cache.get("avc") !== voa) {
      cache.set("avc", voa);
      ave.classList.toggle("hero__ave--voando", voa);
    }
    if (voa) {
      const bx = (-0.2 + tv * 1.4) * geo.W;
      const by = tela(0, 300)[1] + Math.sin(tv * Math.PI * 3) * 10 * geo.s;
      const giro = (Math.cos(tv * Math.PI * 3) * -4).toFixed(1);
      estilo(ave, "transform", `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0) rotate(${giro}deg)`, "avt");
    }

    // painel de hora e geração, no máximo 10 vezes por segundo
    const txtHora = relogio(tSol);
    const txtKw = `${(energia * 4.8).toFixed(1).replace(".", ",")} kW`;
    if ((forcar || agora - ultimoTexto > 100) && (txtHora !== hora.textContent || txtKw !== kw.textContent)) {
      ultimoTexto = agora;
      hora.textContent = txtHora;
      kw.textContent = txtKw;
    }
    opacidade(dica, 1 - suave(p, 0, 0.05), "di");

    // faixas de texto
    faixas.forEach((f, i) => {
      opacidade(f, opacidadeDaFaixa(p, i), `f${i}`);
      const k = montagemDaFaixa(p, i);
      if (k !== faixasK[i]) {
        faixasK[i] = k;
        f.style.setProperty("--k", k.toFixed(3));
      }
    });
    estilo(faixaFinal, "pointerEvents", p > FAIXAS[2][0] + 0.01 ? "auto" : "none", "pe");
  };

  // loop suave que descansa quando chega ao alvo
  let alvo = 0;
  let mostrado = 0;
  let quadro: number | null = null;
  let ultimoTick = 0;
  let naTela = true;
  const progresso = () => {
    const r = hero.getBoundingClientRect();
    const curso = r.height - innerHeight;
    return curso > 0 ? clamp(-r.top / curso, 0, 1) : 1;
  };
  const tick = (agora: number) => {
    const dt = Math.min(100, agora - (ultimoTick || agora));
    ultimoTick = agora;
    mostrado += (alvo - mostrado) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    const parou = Math.abs(alvo - mostrado) < 0.0005;
    if (parou) {
      mostrado = alvo;
      quadro = null;
      ultimoTick = 0;
    } else {
      quadro = requestAnimationFrame(tick);
    }
    desenhar(mostrado, agora, parou);
  };

  // barra do topo: links brancos no céu escuro, azuis no céu claro, faixa sólida quando o hero sai; o flutuante junto
  const atualizarBarra = () => {
    const solido = hero.getBoundingClientRect().bottom < innerHeight - 2;
    const claro = reduzido.matches || progresso() > 0.3;
    topo?.classList.toggle("topo--sobre-claro", claro);
    topo?.classList.toggle("topo--solida", solido);
    flutuante?.classList.toggle("flutuante--visivel", solido);
  };
  const aoRolar = () => {
    atualizarBarra();
    if (reduzido.matches) return;
    alvo = progresso();
    if (quadro === null && naTela) quadro = requestAnimationFrame(tick);
  };
  const aplicarModo = () => {
    if (quadro !== null) cancelAnimationFrame(quadro);
    quadro = null;
    cache.clear();
    faixasK.fill(-1);
    mostrado = alvo = reduzido.matches ? 1 : progresso();
    desenhar(mostrado, performance.now(), true);
    atualizarBarra();
  };
  const aoRedimensionar = () => {
    enquadrar();
    desenhar(mostrado, performance.now(), true);
    aoRolar();
  };
  const observador = new IntersectionObserver(([entrada]) => {
    naTela = entrada.isIntersecting;
    palco.classList.toggle("pausado", !naTela);
    if (naTela) aoRolar();
  });
  const aoMudarAba = () => document.body.classList.toggle("aba-oculta", document.hidden);

  enquadrar();
  aplicarModo();
  hero.classList.add("hero--pronto");
  observador.observe(hero);
  reduzido.addEventListener("change", aplicarModo);
  addEventListener("scroll", aoRolar, { passive: true });
  addEventListener("resize", aoRedimensionar);
  document.addEventListener("visibilitychange", aoMudarAba);

  return () => {
    if (quadro !== null) cancelAnimationFrame(quadro);
    observador.disconnect();
    reduzido.removeEventListener("change", aplicarModo);
    removeEventListener("scroll", aoRolar);
    removeEventListener("resize", aoRedimensionar);
    document.removeEventListener("visibilitychange", aoMudarAba);
    document.body.classList.remove("aba-oculta");
    topo?.classList.remove("topo--sobre-claro", "topo--solida");
    flutuante?.classList.remove("flutuante--visivel");
    hero.classList.remove("hero--pronto");
  };
}
