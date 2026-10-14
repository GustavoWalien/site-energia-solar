import { Secao } from "@/components/ui/Secao";
import { config } from "@/content/config";
import { depoimentos } from "@/content/depoimentos";
import { inicio } from "@/content/inicio";

/** Três depoimentos em balões de fala. No modo conceito, a nota avisa que são ilustrativos. */
export function Depoimentos() {
  return (
    <Secao id="depoimentos" titulo={inicio.depoimentos.titulo} className="depoimentos">
      <ul className="depoimentos__lista">
        {depoimentos.map((d) => (
          <li key={d.nome}>
            <figure className="depoimento">
              <blockquote className="depoimento__balao">
                <p>“{d.texto}”</p>
              </blockquote>
              <figcaption className="depoimento__autor">
                <strong>{d.nome}</strong>, {d.lugar} · {d.tipo}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {config.modoConceito && <p className="depoimentos__nota">{inicio.depoimentos.nota}</p>}
    </Secao>
  );
}
