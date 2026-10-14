import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Capa } from "@/components/blog/Capa";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { acharArtigo, artigosOrdenados, dataPorExtenso } from "@/lib/blog";
import { metadados } from "@/lib/seo";

const t = paginas.blog;

// Com cacheComponents, o Next 16 não aceita dynamicParams: endereço fora da lista cai no notFound().
export function generateStaticParams() {
  return artigosOrdenados.map((a) => ({ slug: a.slug }));
}

// Os artigos saem prontos no build. A página lê o endereço no topo para vir inteira no HTML (sem JavaScript e sem a
// faixa vazia de um Suspense); os cartões da lista usam prefetch={true}, e a navegação continua imediata.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artigo = acharArtigo(slug);
  if (!artigo) return metadados(paginas.naoEncontrada.seo);
  return metadados({ titulo: artigo.metadata.tituloSeo, descricao: artigo.metadata.descricao });
}

export default async function PaginaArtigo({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const artigo = acharArtigo(slug);
  if (!artigo) notFound();
  const { metadata: m, Conteudo } = artigo;
  return (
    <>
      <CabecalhoPagina
        titulo={m.titulo}
        trilha={[
          { rotulo: t.trilhaInicio, href: "/" },
          { rotulo: t.trilhaBlog, href: "/blog" },
          { rotulo: m.titulo },
        ]}
      >
        <p className="artigo__meta">
          <time dateTime={m.data}>{dataPorExtenso(m.data)}</time> · {m.leitura} {t.minutos}
        </p>
      </CabecalhoPagina>
      <article className="artigo">
        <Capa nome={m.capa} className="artigo__capa" />
        <div className="artigo__corpo">
          <Conteudo />
        </div>
        <section className="artigo__fontes" aria-labelledby="fontes-titulo">
          <h2 id="fontes-titulo">{t.fontesTitulo}</h2>
          <ul>
            {m.fontes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener">
                  {f.nome}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <ChamadaFinal />
    </>
  );
}
