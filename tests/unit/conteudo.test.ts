import { describe, expect, it } from "vitest";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { whatsappUrl } from "@/lib/whatsapp";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe("conteúdo da empresa", () => {
  it("o WhatsApp e o e-mail do autor são válidos", () => {
    expect(whatsappUrl(config.autor.whatsapp)).not.toBeNull();
    expect(config.autor.email).toMatch(EMAIL);
  });

  it("com o modo conceito desligado, a empresa precisa de WhatsApp e e-mail de verdade", () => {
    if (config.modoConceito) return;
    expect(whatsappUrl(empresa.whatsapp)).not.toBeNull();
    expect(empresa.emailPedidos).toMatch(EMAIL);
    expect(empresa.remetente).toMatch(EMAIL);
  });

  it("o nome cabe na placa do topo (até 18 caracteres)", () => {
    expect(empresa.nome.length).toBeLessThanOrEqual(18);
  });

  it("título padrão até 60 caracteres com o sufixo e descrição até 160", () => {
    expect(`${empresa.seo.titulo} | ${empresa.nome}`.length).toBeLessThanOrEqual(60);
    expect(empresa.seo.descricao.length).toBeLessThanOrEqual(160);
  });

  it("horário legível e no formato do schema.org, em pares", () => {
    expect(empresa.horario.length).toBeGreaterThan(0);
    expect(empresa.horarioSchema).toHaveLength(empresa.horario.length);
    for (const h of empresa.horarioSchema) {
      expect(h).toMatch(/^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))? \d{2}:\d{2}-\d{2}:\d{2}$/);
    }
  });

  it("tem cidades e exatamente três números", () => {
    expect(empresa.cidades.length).toBeGreaterThan(0);
    expect(empresa.numeros).toHaveLength(3);
  });

  it("o menu aponta para rotas internas únicas", () => {
    const hrefs = menu.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href).toMatch(/^\/[a-z-]+$/);
  });
});
