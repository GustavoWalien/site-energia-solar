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
  return { empresa: { ...empresa, whatsapp: "55 65 99999-8888", emailPedidos: "pedidos@exemplo.com.br" } };
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
});
