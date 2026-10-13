import Link from "next/link";
import { Flor } from "@/components/marca/Flor";
import { IconeWhatsapp } from "@/components/marca/IconeWhatsapp";
import { empresa } from "@/content/empresa";
import { chamadaTopo, menu } from "@/content/navegacao";
import { LinkWhatsapp } from "./LinkWhatsapp";
import { MenuCelular } from "./MenuCelular";

/** Barra do topo: a placa amarela pendurada na faixa azul, links, chamada e, no celular, ícones e menu. */
export function BarraTopo() {
  return (
    <header className="topo" id="topo">
      <Link className="topo__placa" href="/">
        <Flor className="topo__flor" />
        {empresa.nome}
      </Link>
      <nav className="topo__links" aria-label="Principal">
        {menu.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.rotulo}
          </Link>
        ))}
      </nav>
      <LinkWhatsapp className="botao botao--ipe topo__chamada">{chamadaTopo}</LinkWhatsapp>
      <LinkWhatsapp className="topo__icone topo__zap" rotulo="Fale no WhatsApp">
        <IconeWhatsapp />
      </LinkWhatsapp>
      <MenuCelular />
    </header>
  );
}
