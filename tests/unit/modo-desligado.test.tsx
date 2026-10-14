import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// Cliente real: modo conceito desligado e a empresa com WhatsApp próprio.
vi.mock("@/content/config", async (original) => {
  const { config } = await original<typeof import("@/content/config")>();
  return { config: { ...config, modoConceito: false } };
});
vi.mock("@/content/empresa", async (original) => {
  const { empresa } = await original<typeof import("@/content/empresa")>();
  return {
    empresa: {
      ...empresa,
      whatsapp: "55 65 99999-8888",
      emailPedidos: "pedidos@exemplo.com.br",
      telefone: "(65) 3322-1100",
    },
  };
});
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

const { LinkWhatsapp } = await import("@/components/layout/LinkWhatsapp");
const { Rodape } = await import("@/components/layout/Rodape");

describe("modo conceito desligado", () => {
  it("o WhatsApp vai direto para a empresa, com a mensagem pedida e sem aviso", () => {
    const html = renderToStaticMarkup(<LinkWhatsapp mensagem="Quero um orçamento.">Fale</LinkWhatsapp>);
    expect(html).toContain('href="https://wa.me/5565999998888?text=Quero%20um%20or%C3%A7amento."');
    expect(html).not.toContain("data-aviso");
  });

  it("o rodapé fica sem a linha de projeto conceito", () => {
    const html = renderToStaticMarkup(<Rodape />);
    expect(html).toContain("Ipê Solar");
    expect(html).not.toContain("Projeto conceito");
    expect(html).not.toContain("Ver portfólio");
  });

  it("o simulador leva ao WhatsApp da empresa com o valor da conta", async () => {
    const { Simulador } = await import("@/components/inicio/Simulador");
    const html = renderToStaticMarkup(<Simulador />);
    expect(html).toContain("https://wa.me/5565999998888?text=");
    expect(html).toContain(encodeURIComponent("Minha conta de luz fica em torno de R$ 450."));
    expect(html).not.toContain("data-aviso");
  });

  it("a Contato mostra o telefone da empresa com o link tel: certo", async () => {
    const { BlocosContato } = await import("@/components/contato/BlocosContato");
    const html = renderToStaticMarkup(<BlocosContato />);
    expect(html).toContain("Telefone");
    expect(html).toContain('href="tel:+556533221100"');
    expect(html).toContain("(65) 3322-1100");
  });
});
