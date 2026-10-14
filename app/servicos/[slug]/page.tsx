import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { PaginaServico } from "@/components/servicos/PaginaServico";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import { perguntasFrequentes, servicoOferecido, trilha } from "@/lib/jsonld";
import { metadados } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// Com cacheComponents, o Next 16 não aceita dynamicParams: endereço fora da lista cai no notFound().
export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

// Os quatro serviços saem prontos no build. A página lê o endereço no topo para vir inteira no HTML (sem JavaScript e
// sem a faixa vazia de um Suspense); por isso ela não entra na validação de App Shell instantâneo. Os cartões que levam
// aqui usam prefetch={true}, e a navegação continua imediata.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  // endereço fora da lista: o notFound() da página mostra a 404, e o título também é o da 404
  if (!servico) return metadados(paginas.naoEncontrada.seo);
  return metadados(servico.seo, { caminho: `/servicos/${slug}` });
}

export default async function Pagina({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  const t = paginas.servico;
  return (
    <>
      <DadosEstruturados
        dados={[
          servicoOferecido(servico, empresa, SITE_URL),
          trilha(
            [
              { nome: t.trilhaInicio, caminho: "/" },
              { nome: t.trilhaServicos, caminho: "/servicos" },
              { nome: servico.nome, caminho: `/servicos/${servico.slug}` },
            ],
            SITE_URL,
          ),
          perguntasFrequentes(servico.perguntas),
        ]}
      />
      <PaginaServico servico={servico} />
    </>
  );
}
