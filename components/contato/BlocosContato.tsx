import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { empresa } from "@/content/empresa";
import { paginas } from "@/content/paginas";

const t = paginas.contato;

/** Telefone para o link tel:, com o DDI 55. */
function linkTelefone(numero: string): string {
  const digitos = numero.replace(/\D/g, "");
  return `tel:+${digitos.startsWith("55") ? digitos : `55${digitos}`}`;
}

/** WhatsApp, telefone (só se a empresa tiver), horário e local. */
export function BlocosContato() {
  return (
    <div className="contato__blocos">
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.whatsappTitulo}</h2>
        <p>{t.whatsappTexto}</p>
        <LinkWhatsapp className="botao botao--ipe">{t.whatsappBotao}</LinkWhatsapp>
      </div>
      {empresa.telefone && (
        <div className="contato__bloco">
          <h2 className="contato__titulo">{t.telefone}</h2>
          <p>
            <a href={linkTelefone(empresa.telefone)}>{empresa.telefone}</a>
          </p>
        </div>
      )}
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.horario}</h2>
        <ul>
          {empresa.horario.map((h) => (
            <li key={h.dias}>
              {h.dias}, {h.horas}
            </li>
          ))}
        </ul>
      </div>
      <div className="contato__bloco">
        <h2 className="contato__titulo">{t.local}</h2>
        <p>{empresa.mapa.legenda}</p>
      </div>
    </div>
  );
}
