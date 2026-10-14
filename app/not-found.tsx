import Link from "next/link";
import { IlustracaoSombra } from "@/components/erro/IlustracaoSombra";
import { paginas } from "@/content/paginas";
import { metadados } from "@/lib/seo";

const t = paginas.naoEncontrada;

export const metadata = metadados(t.seo);

/** A 404 do site: "Essa página tomou sombra", com a ilustração e o caminho de volta. */
export default function NaoEncontrada() {
  return (
    <section className="nao-encontrada">
      <div className="nao-encontrada__miolo">
        <IlustracaoSombra className="nao-encontrada__desenho" />
        <div>
          <p className="rotulo">404</p>
          <h1 className="nao-encontrada__titulo">{t.titulo}</h1>
          <p className="nao-encontrada__texto">{t.texto}</p>
          <Link className="botao botao--ipe" href="/">
            {t.botao}
          </Link>
        </div>
      </div>
    </section>
  );
}
