import { BlocosContato } from "@/components/contato/BlocosContato";
import { Mapa } from "@/components/contato/Mapa";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu, rotuloInicio } from "@/content/navegacao";
import { paginas } from "@/content/paginas";
import { negocioLocal, trilha } from "@/lib/jsonld";
import { metadados } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const t = paginas.contato;

export const metadata = metadados(t.seo, { caminho: "/contato" });

export default function Contato() {
  return (
    <>
      <DadosEstruturados
        dados={[
          negocioLocal(config, empresa, SITE_URL),
          trilha(
            [
              { nome: rotuloInicio, caminho: "/" },
              { nome: menu.find((l) => l.href === "/contato")!.rotulo, caminho: "/contato" },
            ],
            SITE_URL,
          ),
        ]}
      />
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
