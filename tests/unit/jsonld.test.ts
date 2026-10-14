import { describe, expect, it } from "vitest";
import { acharArtigo } from "@/lib/blog";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { perguntas } from "@/content/perguntas";
import { servicos } from "@/content/servicos";
import {
  artigoDoBlog,
  negocioLocal,
  perguntasFrequentes,
  serializar,
  servicoOferecido,
  trilha,
} from "@/lib/jsonld";

const SITE = "https://ipe-solar.vercel.app";

describe("dados estruturados", () => {
  it("modo conceito: o negócio não tem telefone nem rua, só cidade, estado, país, áreas e horário", () => {
    const negocio = negocioLocal(config, empresa, SITE);
    const texto = JSON.stringify(negocio);
    expect(texto).not.toContain("telephone");
    expect(texto).not.toContain("streetAddress");
    expect(negocio).toMatchObject({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE}/#negocio`,
      name: "Ipê Solar",
      url: SITE,
      image: `${SITE}/opengraph-image.png`,
      address: { "@type": "PostalAddress", addressLocality: "Cuiabá", addressRegion: "MT", addressCountry: "BR" },
      openingHours: ["Mo-Fr 07:00-17:00", "Sa 07:00-11:00"],
    });
    expect(negocio.areaServed).toHaveLength(empresa.cidades.length);
  });

  it("modo desligado: o negócio leva o telefone, ou o WhatsApp quando não há fixo", () => {
    const real = { ...config, modoConceito: false };
    expect(negocioLocal(real, { ...empresa, telefone: "(65) 3333-4444" }, SITE).telephone).toBe("(65) 3333-4444");
    expect(negocioLocal(real, { ...empresa, telefone: "", whatsapp: "55 65 99999-8888" }, SITE).telephone).toBe(
      "55 65 99999-8888",
    );
  });

  it("perguntas frequentes: uma Question com Answer para cada pergunta", () => {
    const faq = perguntasFrequentes(perguntas);
    expect(faq["@type"]).toBe("FAQPage");
    const itens = faq.mainEntity as { "@type": string; name: string; acceptedAnswer: { text: string } }[];
    expect(itens).toHaveLength(perguntas.length);
    expect(itens[0]).toMatchObject({
      "@type": "Question",
      name: perguntas[0].pergunta,
      acceptedAnswer: { "@type": "Answer", text: perguntas[0].resposta },
    });
  });

  it("trilha: posições a partir de 1 e endereços completos, com a raiz sem barra", () => {
    const t = trilha(
      [
        { nome: "Início", caminho: "/" },
        { nome: "Blog", caminho: "/blog" },
      ],
      SITE,
    );
    expect(t).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      ],
    });
  });

  it("serviço: o provedor é o negócio, pelo mesmo @id", () => {
    const s = servicoOferecido(servicos[0], empresa, SITE);
    expect(s).toMatchObject({
      "@type": "Service",
      name: servicos[0].nome,
      url: `${SITE}/servicos/${servicos[0].slug}`,
      provider: { "@type": "LocalBusiness", "@id": `${SITE}/#negocio`, name: "Ipê Solar" },
    });
  });

  it("artigo: título, data, imagem própria e a empresa como autora", () => {
    const artigo = acharArtigo("energia-solar-vale-a-pena-2026-fio-b")!;
    const url = `${SITE}/blog/${artigo.slug}`;
    expect(artigoDoBlog(artigo, empresa, SITE)).toMatchObject({
      "@type": "BlogPosting",
      headline: artigo.metadata.titulo,
      datePublished: artigo.metadata.data,
      inLanguage: "pt-BR",
      url,
      image: `${url}/opengraph-image`,
      author: { "@type": "Organization", name: "Ipê Solar" },
    });
  });

  it("serializar escapa o < para o texto não fechar o <script>, e o JSON continua igual", () => {
    const dados = { name: '</script><script>alert("oi")</script>' };
    const texto = serializar(dados);
    expect(texto).not.toContain("<");
    expect(JSON.parse(texto)).toEqual(dados);
  });
});
