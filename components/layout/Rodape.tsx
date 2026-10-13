import Link from "next/link";
import { Flor } from "@/components/marca/Flor";
import { conceito } from "@/content/conceito";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { linhaConceito } from "@/lib/conceito";

/** Rodapé azul-profundo: marca, páginas, horário, cidades e, no modo conceito, o aviso de projeto conceito. */
export function Rodape() {
  const aviso = linhaConceito(config, conceito);
  const paginas = [{ rotulo: "Início", href: "/" }, ...menu];
  return (
    <footer className="rodape escuro">
      <div className="rodape__grade">
        <div>
          <p className="rodape__marca">
            <Flor className="rodape__flor" />
            {empresa.nome}
          </p>
          <p className="rodape__frase">{empresa.frase}</p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="rodape__titulo">Páginas</h2>
          <ul>
            {paginas.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{p.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="rodape__titulo">Atendimento</h2>
          <ul>
            {empresa.horario.map((h) => (
              <li key={h.dias}>
                {h.dias}, {h.horas}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="rodape__titulo">Onde atendemos</h2>
          <p>{empresa.cidades.join(", ")}.</p>
        </div>
      </div>
      <div className="rodape__base">
        <span>
          © {empresa.nome} · {empresa.cidade}-{empresa.estado}
        </span>
        {aviso && (
          <span>
            {aviso.texto} <a href={aviso.href}>Ver portfólio</a>
          </span>
        )}
      </div>
    </footer>
  );
}
