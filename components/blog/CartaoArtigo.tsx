import Link from "next/link";
import type { Artigo } from "@/content/blog";
import { paginas } from "@/content/paginas";
import { Capa } from "./Capa";

const t = paginas.blog;

/** Cartão de um artigo na lista do blog. prefetch={true}: o artigo lê o endereço, e assim já vem antes do clique. */
export function CartaoArtigo({ artigo }: { artigo: Artigo }) {
  const { slug, metadata: m } = artigo;
  return (
    <li className="cartao-artigo">
      <Capa nome={m.capa} className="cartao-artigo__capa" />
      <div className="cartao-artigo__corpo">
        <p className="cartao-artigo__meta">
          {m.leitura} {t.minutos}
        </p>
        <h2 className="cartao-artigo__titulo">{m.titulo}</h2>
        <p className="cartao-artigo__texto">{m.descricao}</p>
        <Link className="cartao-artigo__link" href={`/blog/${slug}`} prefetch={true}>
          {t.lerArtigo} <span aria-hidden="true">→</span>
          <span className="sr-only">: {m.titulo}</span>
        </Link>
      </div>
    </li>
  );
}
