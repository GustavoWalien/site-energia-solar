type Props = { titulo: string; texto: string };

/** Página provisória enquanto a definitiva não chega (Planos 2 a 4). */
export function EmConstrucao({ titulo, texto }: Props) {
  return (
    <section className="mx-auto w-[min(1120px,calc(100%-32px))] pt-36 pb-32">
      <p className="font-mono text-[0.78rem] tracking-[0.14em] text-rotulo uppercase">Em construção</p>
      <h1 className="mt-4 max-w-[16ch] text-5xl leading-none font-extrabold">{titulo}</h1>
      <p className="mt-5 max-w-[60ch] text-tinta-suave">{texto}</p>
    </section>
  );
}
