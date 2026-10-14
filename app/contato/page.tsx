import { BlocosContato } from "@/components/contato/BlocosContato";
import { Mapa } from "@/components/contato/Mapa";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { paginas } from "@/content/paginas";
import { metadados } from "@/lib/seo";

const t = paginas.contato;

export const metadata = metadados(t.seo);

export default function Contato() {
  return (
    <>
      <CabecalhoPagina titulo={t.titulo} apoio={t.apoio} />
      <section className="contato" aria-label={t.blocosRotulo}>
        <div className="contato__miolo">
          <BlocosContato />
          <Mapa />
        </div>
      </section>
      <ChamadaFinal />
    </>
  );
}
