import type { Artigo } from "@/content/blog";
import type { Config, Empresa, Pergunta, Servico } from "@/content/tipos";

/** Um bloco de dados estruturados (schema.org). */
export type Dados = Record<string, unknown>;

const CONTEXTO = "https://schema.org";

const endereco = (siteUrl: string, caminho: string) => (caminho === "/" ? siteUrl : `${siteUrl}${caminho}`);

const cidades = (empresa: Empresa) => empresa.cidades.map((nome) => ({ "@type": "City", name: nome }));

/** Telefone no formato internacional (+55, DDD e número, só dígitos), venha ele com ou sem o 55. */
export function telefoneInternacional(numero: string): string {
  const digitos = numero.replace(/\D/g, "");
  return digitos.startsWith("55") && digitos.length >= 12 ? `+${digitos}` : `+55${digitos}`;
}

/** O negócio. No modo conceito, sem telefone e sem rua: só cidade, estado, país, áreas atendidas e horário. */
export function negocioLocal(config: Config, empresa: Empresa, siteUrl: string): Dados {
  const numero = config.modoConceito ? "" : empresa.telefone || empresa.whatsapp;
  const telefone = numero ? telefoneInternacional(numero) : "";
  return {
    "@context": CONTEXTO,
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#negocio`,
    name: empresa.nome,
    description: empresa.seo.descricao,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.png`,
    logo: `${siteUrl}/apple-icon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: empresa.cidade,
      addressRegion: empresa.estado,
      addressCountry: "BR",
    },
    areaServed: cidades(empresa),
    openingHours: empresa.horarioSchema,
    ...(telefone ? { telephone: telefone } : {}),
  };
}

/** As perguntas frequentes de uma página. */
export function perguntasFrequentes(perguntas: Pergunta[]): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "FAQPage",
    mainEntity: perguntas.map((p) => ({
      "@type": "Question",
      name: p.pergunta,
      acceptedAnswer: { "@type": "Answer", text: p.resposta },
    })),
  };
}

export type ItemTrilha = { nome: string; caminho: string };

/** A trilha de navegação, da Início até a página. */
export function trilha(itens: ItemTrilha[], siteUrl: string): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: endereco(siteUrl, item.caminho),
    })),
  };
}

/** Um serviço, com o negócio como provedor (o mesmo @id do LocalBusiness). */
export function servicoOferecido(servico: Servico, empresa: Empresa, siteUrl: string): Dados {
  return {
    "@context": CONTEXTO,
    "@type": "Service",
    name: servico.nome,
    description: servico.seo.descricao,
    url: endereco(siteUrl, `/servicos/${servico.slug}`),
    provider: { "@type": "LocalBusiness", "@id": `${siteUrl}/#negocio`, name: empresa.nome, url: siteUrl },
    areaServed: cidades(empresa),
  };
}

/** Um artigo do blog, com a imagem própria e a empresa como autora e editora. */
export function artigoDoBlog(artigo: Artigo, empresa: Empresa, siteUrl: string): Dados {
  const url = endereco(siteUrl, `/blog/${artigo.slug}`);
  const organizacao = { "@type": "Organization", name: empresa.nome, url: siteUrl, logo: `${siteUrl}/apple-icon.png` };
  return {
    "@context": CONTEXTO,
    "@type": "BlogPosting",
    headline: artigo.metadata.titulo,
    description: artigo.metadata.descricao,
    datePublished: artigo.metadata.data,
    inLanguage: "pt-BR",
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: organizacao,
    publisher: organizacao,
  };
}

/** O JSON do <script>, com o < escapado para nenhum texto fechar a tag (guia json-ld.md do Next). */
export function serializar(dados: Dados): string {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
