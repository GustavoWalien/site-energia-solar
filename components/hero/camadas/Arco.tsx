import { ARCOS, amostrarArco, dDoArco, marcasDeHora } from "../geometria";
import { Camada } from "./Camada";

/** O caminho pontilhado do sol, que se desenha com o scroll, e as marcas de hora que ficam depois que o sol passa. */
export function Arco() {
  const d = dDoArco(ARCOS.paisagem);
  return (
    <Camada id="hero-arco">
      <defs>
        <mask id="hero-mascara-arco" maskUnits="userSpaceOnUse" x="-400" y="-600" width="2400" height="1800">
          <path
            id="hero-arco-mascara"
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth="24"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset="1"
          />
        </mask>
      </defs>
      <g mask="url(#hero-mascara-arco)" fill="none" strokeLinecap="round">
        <path className="hero__arco" d={d} stroke="#0E3557" strokeWidth="11" strokeDasharray="0 24" />
        <path className="hero__arco" d={d} stroke="#FFD23F" strokeWidth="6" strokeDasharray="0 24" />
      </g>
      <g className="hero__horas" fontSize="16" fontWeight="500" textAnchor="middle">
        {marcasDeHora(amostrarArco(ARCOS.paisagem)).map((m) => (
          <g key={m.texto} className="hero__hora" data-t={m.t} transform={`translate(${m.x} ${m.y})`} opacity="0">
            <rect x="-36" y="-15" width="72" height="30" rx="15" fill="#FFFFFF" stroke="#0E3557" strokeWidth="2.5" />
            <text y="6" fill="#0E3557">
              {m.texto}
            </text>
          </g>
        ))}
      </g>
    </Camada>
  );
}
