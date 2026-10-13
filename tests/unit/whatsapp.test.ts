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
});
