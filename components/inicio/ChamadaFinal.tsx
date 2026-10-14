import { FormularioPedido } from "@/components/contato/FormularioPedido";
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { inicio } from "@/content/inicio";

const t = inicio.chamadaFinal;

/** Bloco azul-profundo do fim da página: o WhatsApp de um lado e o formulário do outro. */
export function ChamadaFinal() {
  return (
    <section id="orcamento" className="chamada escuro" aria-labelledby="orcamento-titulo">
      <div className="chamada__miolo">
        <div>
          <h2 id="orcamento-titulo" className="chamada__titulo">
            {t.titulo}
          </h2>
          <p className="chamada__apoio">{t.apoio}</p>
          <LinkWhatsapp className="botao botao--ipe">{t.botao}</LinkWhatsapp>
        </div>
        <div className="chamada__formulario">
          <p className="chamada__formulario-titulo">{t.formulario}</p>
          <FormularioPedido />
        </div>
      </div>
    </section>
  );
}
