import { describe, expect, it } from "vitest";
import { empresa } from "@/content/empresa";
import { equipe } from "@/content/equipe";
import { paginas } from "@/content/paginas";
import { servicos } from "@/content/servicos";
import type { Seo } from "@/content/tipos";
import { tituloFinal } from "@/lib/seo";

function conferirSeo(seo: Seo) {
  expect(tituloFinal(seo, empresa.nome).length).toBeLessThanOrEqual(60);
  expect(seo.descricao.length).toBeGreaterThanOrEqual(50);
  expect(seo.descricao.length).toBeLessThanOrEqual(160);
}

describe("conteúdo das páginas", () => {
  it.each(servicos.map((s) => [s.slug, s] as const))("%s: SEO, H1, listas e perguntas completos", (_, s) => {
    conferirSeo(s.seo);
    expect(s.h1.length).toBeGreaterThan(10);
    expect(s.abertura.length).toBeGreaterThan(80);
    expect(s.incluido.itens.length).toBeGreaterThanOrEqual(3);
    expect(s.extra.itens.length).toBeGreaterThanOrEqual(2);
    expect(s.perguntas.length).toBeGreaterThanOrEqual(2);
  });

  it("os títulos SEO dos serviços seguem docs/textos.md", () => {
    expect(servicos.map((s) => tituloFinal(s.seo, empresa.nome))).toEqual([
      "Energia solar residencial em Cuiabá | Ipê Solar",
      "Energia solar para empresas em Cuiabá | Ipê Solar",
      "Energia solar rural em Mato Grosso | Ipê Solar",
      "Limpeza de placas solares em Cuiabá | Ipê Solar",
    ]);
  });

  it("lista de serviços, Sobre, Contato e 404 com SEO no tamanho", () => {
    for (const seo of [paginas.servicos.seo, paginas.sobre.seo, paginas.contato.seo, paginas.naoEncontrada.seo]) {
      conferirSeo(seo);
    }
    expect(tituloFinal(paginas.sobre.seo, empresa.nome)).toBe("Sobre a Ipê Solar | Energia solar em Cuiabá");
    expect(tituloFinal(paginas.contato.seo, empresa.nome)).toBe("Contato | Ipê Solar Cuiabá");
  });

  it("a equipe tem quatro pessoas com nomes e retratos diferentes", () => {
    expect(equipe.map((m) => m.nome)).toEqual(["Marina Duarte", "Paulo Arruda", "Luana Campos", "Tião Moraes"]);
    expect(new Set(equipe.map((m) => JSON.stringify(m.retrato))).size).toBe(4);
  });

  it("o modelo de mensagem do serviço tem onde pôr o nome do serviço", () => {
    expect(paginas.servico.mensagem).toContain("{servico}");
  });

  it("no modo conceito não há telefone inventado", () => {
    expect(empresa.telefone).toBe("");
  });
});
