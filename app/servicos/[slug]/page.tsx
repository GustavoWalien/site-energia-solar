import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaServico } from "@/components/servicos/PaginaServico";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import { metadados } from "@/lib/seo";

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
  return metadados(servico ? servico.seo : paginas.naoEncontrada.seo);
}

export default async function Pagina({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  return <PaginaServico servico={servico} />;
}
