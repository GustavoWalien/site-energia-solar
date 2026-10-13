import { IconeWhatsapp } from "@/components/marca/IconeWhatsapp";
import { LinkWhatsapp } from "./LinkWhatsapp";

/** Botão redondo de WhatsApp, fixo no canto. O Plano 2 o esconde enquanto o hero ocupa a tela. */
export function WhatsappFlutuante() {
  return (
    <LinkWhatsapp id="whatsapp-flutuante" className="flutuante" rotulo="Fale no WhatsApp">
      <IconeWhatsapp />
    </LinkWhatsapp>
  );
}
