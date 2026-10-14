import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { IconePromessa } from "./IconePromessa";

/** As quatro promessas, em grade 2 × 2: a resposta aos medos mais comuns da pesquisa. */
export function Promessas() {
  return (
    <Secao id="promessas" titulo={inicio.promessas.titulo} className="promessas">
      <ul className="promessas__lista">
        {inicio.promessas.itens.map((p) => (
          <li key={p.titulo} className="promessa">
            <IconePromessa nome={p.icone} className="promessa__icone" />
            <div>
              <h3 className="promessa__titulo">{p.titulo}</h3>
              <p className="promessa__texto">{p.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
