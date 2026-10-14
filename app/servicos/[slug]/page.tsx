import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PaginaServico } from "@/components/servicos/PaginaServico";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import { metadados } from "@/lib/seo";

// Com cacheComponents, o Next 16 não aceita dynamicParams: endereço fora da lista cai no notFound().
export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  // endereço fora da lista: o notFound() da página mostra a 404, e o título também é o da 404
  return metadados(servico ? servico.seo : paginas.naoEncontrada.seo);
}

/** Lê o endereço dentro do Suspense: o App Shell (barra e rodapé) fica igual para todo link e chega na hora. */
async function Conteudo({ params }: Pick<PageProps<"/servicos/[slug]">, "params">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  return <PaginaServico servico={servico} />;
}

export default function Pagina({ params }: PageProps<"/servicos/[slug]">) {
  return (
    <Suspense fallback={<div className="cabecalho" aria-busy="true" />}>
      <Conteudo params={params} />
    </Suspense>
  );
}
