import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { inicio } from "@/content/inicio";
import { Arco } from "./camadas/Arco";
import { Ave } from "./camadas/Ave";
import { Ceu } from "./camadas/Ceu";
import { Frente } from "./camadas/Frente";
import { Longe } from "./camadas/Longe";
import { Meio } from "./camadas/Meio";
import { Nuvens } from "./camadas/Nuvens";
import { Perto } from "./camadas/Perto";
import { Sol } from "./camadas/Sol";
import { Faixa } from "./Faixa";

const t = inicio.hero;

/** Hero da Início: o dia em Cuiabá, da madrugada ao meio-dia, guiado pelo scroll. Todo o desenho sai pronto do servidor. */
export function Hero() {
  const [madrugada, manha, meioDia] = t.faixas;
  return (
    <section className="hero" id="hero" aria-labelledby="hero-titulo">
      <div className="hero__palco" id="hero-palco">
        <div className="hero__cena">
          <Ceu />
          <Arco />
          <Sol />
          <Nuvens />
          <Ave />
          <Longe />
          <Meio />
          <Perto />
          <Frente />
          <div className="hero__sombra-noite" id="hero-sombra-noite" aria-hidden="true" />
          <div className="hero__brilho-nascer" id="hero-brilho-nascer" aria-hidden="true" />
        </div>
        <div className="hero__faixas">
          <Faixa indice={0} faixa={madrugada} titulo="h1" id="hero-titulo" />
          <Faixa indice={1} faixa={manha} />
          <Faixa indice={2} faixa={meioDia}>
            <div className="hero__acoes">
              <LinkWhatsapp className="botao botao--ipe">{t.botaoOrcamento}</LinkWhatsapp>
              <a className="hero__link" href="#simulador">
                {t.botaoSimular}
              </a>
            </div>
          </Faixa>
        </div>
        <div className="hero__painel" aria-hidden="true">
          <div className="hero__painel-linha">
            <small>{t.painel.lugar}</small>
            <strong id="hero-hora">05:40</strong>
          </div>
          <div className="hero__painel-linha">
            <small>{t.painel.gerando}</small>
            <strong id="hero-kw">0,0 kW</strong>
          </div>
          <div className="hero__painel-barra">
            <i id="hero-barra" />
          </div>
        </div>
        <div className="hero__dica" id="hero-dica" aria-hidden="true">
          {t.dica}
          <i />
        </div>
      </div>
    </section>
  );
}
