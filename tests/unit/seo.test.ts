import { describe, expect, it } from "vitest";
import { IMAGEM_PADRAO, metadados, tituloFinal } from "@/lib/seo";

describe("seo", () => {
  it("título comum ganha o sufixo do modelo do layout", () => {
    const seo = { titulo: "Energia solar rural em Mato Grosso", descricao: "Texto." };
    const m = metadados(seo);
    expect(m.title).toBe("Energia solar rural em Mato Grosso");
    expect(m.description).toBe("Texto.");
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Energia solar rural em Mato Grosso | Ipê Solar");
  });

  it("título absoluto ignora o modelo, porque já traz a marca", () => {
    const seo = { titulo: "Contato | Ipê Solar Cuiabá", descricao: "Texto.", absoluto: true };
    expect(metadados(seo).title).toEqual({ absolute: "Contato | Ipê Solar Cuiabá" });
    expect(tituloFinal(seo, "Ipê Solar")).toBe("Contato | Ipê Solar Cuiabá");
  });

  it("com o caminho, a página ganha canônico, og:url e a imagem da Início", () => {
    const m = metadados({ titulo: "Serviços de energia solar em Cuiabá", descricao: "Texto." }, { caminho: "/servicos" });
    expect(m.alternates).toEqual({ canonical: "/servicos" });
    expect(m.openGraph).toMatchObject({
      url: "/servicos",
      type: "website",
      locale: "pt_BR",
      siteName: "Ipê Solar",
      title: "Serviços de energia solar em Cuiabá | Ipê Solar",
      description: "Texto.",
      images: [IMAGEM_PADRAO],
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: [IMAGEM_PADRAO] });
  });

  it("sem caminho (a 404), não há canônico nem og:url", () => {
    const m = metadados({ titulo: "Página não encontrada", descricao: "Texto." });
    expect(m.alternates).toBeUndefined();
    expect(m.openGraph).not.toHaveProperty("url");
  });

  it("o artigo é article, com a data, e não leva a imagem da Início (a dele vem do opengraph-image.tsx)", () => {
    const m = metadados(
      { titulo: "Fio B em 2026", descricao: "Texto." },
      { caminho: "/blog/x", artigo: { publicado: "2026-10-08" } },
    );
    expect(m.openGraph).toMatchObject({ type: "article", publishedTime: "2026-10-08", url: "/blog/x" });
    expect(m.openGraph).not.toHaveProperty("images");
    expect(m.twitter).not.toHaveProperty("images");
  });

  it("o título de compartilhamento, quando existe, vira o og:title", () => {
    const m = metadados(
      { titulo: "Energia solar em Cuiabá", descricao: "Texto.", compartilhamento: "Ipê Solar · Energia solar em Cuiabá" },
      { caminho: "/" },
    );
    expect(m.openGraph?.title).toBe("Ipê Solar · Energia solar em Cuiabá");
    expect(m.twitter?.title).toBe("Ipê Solar · Energia solar em Cuiabá");
  });

  it("a imagem padrão tem 1200 × 630 e texto alternativo", () => {
    expect(IMAGEM_PADRAO).toMatchObject({ url: "/opengraph-image.png", width: 1200, height: 630 });
    expect(IMAGEM_PADRAO.alt.length).toBeGreaterThan(20);
  });
});
