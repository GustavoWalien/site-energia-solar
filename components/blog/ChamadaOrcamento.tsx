import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { paginas } from "@/content/paginas";

const t = paginas.blog.chamada;

/** Chamada para o orçamento no fim dos artigos, pelo WhatsApp (no modo conceito, abre o aviso). */
export function ChamadaOrcamento() {
  return (
    <aside className="chamada-orcamento">
      <p className="chamada-orcamento__titulo">{t.titulo}</p>
      <p>{t.texto}</p>
      <LinkWhatsapp className="botao botao--ipe">{t.botao}</LinkWhatsapp>
    </aside>
  );
}
