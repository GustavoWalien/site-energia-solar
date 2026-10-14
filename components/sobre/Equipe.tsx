import { equipe } from "@/content/equipe";
import { Retrato } from "./Retrato";

/** A equipe em quatro cartões, cada um com o retrato ilustrado. */
export function Equipe() {
  return (
    <ul className="equipe">
      {equipe.map((m, i) => (
        <li key={m.nome} className="membro">
          <Retrato retrato={m.retrato} id={`retrato-${i}`} className="membro__retrato" />
          <h3 className="membro__nome">{m.nome}</h3>
          <p className="membro__cargo">{m.cargo}</p>
          <p className="membro__texto">{m.texto}</p>
        </li>
      ))}
    </ul>
  );
}
