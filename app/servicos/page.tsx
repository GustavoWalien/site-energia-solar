import { CartaoServico } from "@/components/servicos/CartaoServico";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import { metadados } from "@/lib/seo";

const t = paginas.servicos;

export const metadata = metadados(t.seo, { caminho: "/servicos" });

export default function Servicos() {
  return (
    <>
      <CabecalhoPagina rotulo={t.rotulo} titulo={t.titulo} apoio={t.apoio} />
      <section className="secao" aria-label={t.rotulo}>
        <div className="secao__miolo">
          <ul className="fazemos__lista">
            {servicos.map((s) => (
              <CartaoServico key={s.slug} servico={s} nivel="h2" />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
