import type { Config, Empresa } from "@/content/tipos";
import { whatsappUrl } from "./whatsapp";

export type DestinoWhatsapp = {
  href: string;
  /** Verdadeiro no modo conceito: o clique abre o aviso antes de sair do site. */
  aviso: boolean;
};

export function destinoWhatsapp(config: Config, empresa: Empresa, mensagem?: string): DestinoWhatsapp {
  if (config.modoConceito) {
    const href = whatsappUrl(config.autor.whatsapp, config.autor.mensagemWhatsapp);
    if (!href) throw new Error("WhatsApp do autor inválido em content/config.ts");
    return { href, aviso: true };
  }
  const href = whatsappUrl(empresa.whatsapp, mensagem ?? empresa.mensagemWhatsapp);
  if (!href) throw new Error("WhatsApp da empresa inválido em content/empresa.ts");
  return { href, aviso: false };
}
