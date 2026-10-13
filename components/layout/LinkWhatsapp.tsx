import type { ReactNode } from "react";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { destinoWhatsapp } from "@/lib/contato";

type Props = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Mensagem pronta para a empresa. No modo conceito vale a mensagem do autor. */
  mensagem?: string;
  /** Nome acessível, quando o conteúdo é só um ícone. */
  rotulo?: string;
};

/** Link de WhatsApp. No modo conceito, o clique abre o aviso (AvisoConceito) antes de sair do site. */
export function LinkWhatsapp({ children, id, className, mensagem, rotulo }: Props) {
  const destino = destinoWhatsapp(config, empresa, mensagem);
  return (
    <a
      id={id}
      className={className}
      href={destino.href}
      target="_blank"
      rel="noopener"
      aria-label={rotulo}
      data-aviso={destino.aviso ? "" : undefined}
    >
      {children}
    </a>
  );
}
