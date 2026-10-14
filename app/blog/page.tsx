import { CartaoArtigo } from "@/components/blog/CartaoArtigo";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { artigosOrdenados } from "@/lib/blog";
import { metadados } from "@/lib/seo";

const t = paginas.blog;

export const metadata = metadados(t.seo);

export default function Blog() {
  return (
    <>
      <CabecalhoPagina rotulo={t.rotulo} titulo={t.titulo} apoio={t.apoio} />
      <section className="secao" aria-label={t.rotulo}>
        <div className="secao__miolo">
          <ul className="artigos">
            {artigosOrdenados.map((a) => (
              <CartaoArtigo key={a.slug} artigo={a} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
