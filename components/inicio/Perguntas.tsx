import { ListaPerguntas } from "@/components/ui/ListaPerguntas";
import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { perguntas } from "@/content/perguntas";

/** As oito perguntas frequentes da Início. */
export function Perguntas() {
  return (
    <Secao id="perguntas" titulo={inicio.perguntas.titulo} className="perguntas">
      <ListaPerguntas perguntas={perguntas} />
    </Secao>
  );
}
