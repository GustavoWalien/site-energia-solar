import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("usa NEXT_PUBLIC_SITE_URL sem a barra final", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://ipesolar.com.br/" })).toBe("https://ipesolar.com.br");
  });

  it("usa o domínio de produção da Vercel", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "ipe-solar.vercel.app" })).toBe("https://ipe-solar.vercel.app");
  });

  it("NEXT_PUBLIC_SITE_URL vence o domínio da Vercel", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://a.com.br", VERCEL_PROJECT_PRODUCTION_URL: "b.vercel.app" }),
    ).toBe("https://a.com.br");
  });

  it("sem variáveis, cai no endereço padrão", () => {
    expect(resolveSiteUrl({})).toBe("https://ipe-solar.vercel.app");
  });
});
