import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";

describe("whatsappUrl", () => {
  it("tira tudo que não é dígito", () => {
    expect(whatsappUrl("55 65 98122-2210")).toBe("https://wa.me/5565981222210");
  });

  it("codifica a mensagem", () => {
    expect(whatsappUrl("5565981222210", "Olá! Tudo bem?")).toBe(
      "https://wa.me/5565981222210?text=Ol%C3%A1!%20Tudo%20bem%3F",
    );
  });

  it("número vazio ou curto devolve null", () => {
    expect(whatsappUrl("")).toBeNull();
    expect(whatsappUrl("12345")).toBeNull();
  });

  it("aceita fixo e celular do Brasil com o DDI 55", () => {
    expect(whatsappUrl("+55 (65) 3322-1100")).toBe("https://wa.me/556533221100");
    expect(whatsappUrl("55 65 99999-8888")).toBe("https://wa.me/5565999998888");
  });

  it("sem o DDI 55 devolve null, em vez de mandar para outro país", () => {
    // "(65) 99999-8888" viraria wa.me/65..., que o WhatsApp lê como +65 (Singapura)
    expect(whatsappUrl("(65) 99999-8888")).toBeNull();
    expect(whatsappUrl("(65) 3322-1100")).toBeNull();
    expect(whatsappUrl("1 415 555 2671")).toBeNull();
  });
});
