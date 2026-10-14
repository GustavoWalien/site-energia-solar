import { CartaoServico } from "@/components/servicos/CartaoServico";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { servicos } from "@/content/servicos";

/** Os quatro serviços em cartões, cada um levando à sua página. */
export function OQueFazemos() {
  return (
    <Secao id="o-que-fazemos" rotulo={inicio.oQueFazemos.rotulo} titulo={inicio.oQueFazemos.titulo}>
      <ul className="fazemos__lista">
        {servicos.map((s) => (
          <CartaoServico key={s.slug} servico={s} nivel="h3" />
        ))}
      </ul>
    </Secao>
  );
}
