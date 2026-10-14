import Link from "next/link";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { servicos } from "@/content/servicos";
import { IconeServico } from "./IconeServico";

/** Os quatro serviços em cartões, cada um levando à sua página. */
export function OQueFazemos() {
  return (
    <Secao id="o-que-fazemos" rotulo={inicio.oQueFazemos.rotulo} titulo={inicio.oQueFazemos.titulo}>
      <ul className="fazemos__lista">
        {servicos.map((s) => (
          <li key={s.slug} className="fazemos__cartao">
            <IconeServico nome={s.icone} className="fazemos__icone" />
            <h3 className="fazemos__titulo">{s.cartao.titulo}</h3>
            <p className="fazemos__texto">{s.cartao.texto}</p>
            <Link className="fazemos__link" href={`/servicos/${s.slug}`}>
              {s.nome} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
