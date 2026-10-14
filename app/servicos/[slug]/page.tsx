import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmConstrucao } from "@/components/ui/EmConstrucao";
import { servicos } from "@/content/servicos";

// Com cacheComponents, o Next 16 não aceita dynamicParams: endereço fora da lista cai no notFound().
export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: servicos.find((s) => s.slug === slug)?.nome };
}

export default async function PaginaServico({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();
  return <EmConstrucao titulo={servico.nome} texto="A página deste serviço chega no Plano 3." />;
}
