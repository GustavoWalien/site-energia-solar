import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";

describe("DadosEstruturados", () => {
  const dados = [
    { "@type": "BreadcrumbList", a: 1 },
    { "@type": "BreadcrumbList", a: 2 },
  ];

  it("dois blocos do mesmo tipo saem os dois, cada um com a sua chave", () => {
    const elementos = DadosEstruturados({ dados }) as ReactElement[];
    const chaves = elementos.map((e) => e.key);
    expect(new Set(chaves).size).toBe(dados.length);
    expect(renderToStaticMarkup(<DadosEstruturados dados={dados} />).match(/application\/ld\+json/g)).toHaveLength(2);
  });
});
