import { MapaDesenhado } from "@/components/contato/MapaDesenhado";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { Equipe } from "@/components/sobre/Equipe";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { Secao } from "@/components/ui/Secao";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { menu } from "@/content/navegacao";
import { paginas } from "@/content/paginas";
import { negocioLocal, trilha } from "@/lib/jsonld";
import { metadados } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const t = paginas.sobre;

export const metadata = metadados(t.seo, { caminho: "/sobre" });

export default function Sobre() {
  return (
    <>
      <DadosEstruturados
        dados={[
          negocioLocal(config, empresa, SITE_URL),
          trilha(
            [
              { nome: paginas.servico.trilhaInicio, caminho: "/" },
              { nome: menu.find((l) => l.href === "/sobre")!.rotulo, caminho: "/sobre" },
            ],
            SITE_URL,
          ),
        ]}
      />
      <CabecalhoPagina rotulo={t.rotulo} titulo={t.titulo} apoio={t.historia} />
      <Secao id="numeros" titulo={t.numerosTitulo}>
        <ul className="numeros__lista">
          {empresa.numeros.map((n) => (
            <li key={n.rotulo}>
              <strong>{n.valor}</strong>
              <span>{n.rotulo}</span>
            </li>
          ))}
        </ul>
      </Secao>
      <Secao id="equipe" titulo={t.equipeTitulo}>
        <Equipe />
      </Secao>
      <Secao id="onde-atendemos" titulo={t.ondeTitulo} className="onde">
        <div className="onde__grade">
          <div>
            <p className="onde__apoio">{t.ondeApoio}</p>
            <ul className="onde__cidades">
              {empresa.cidades.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <MapaDesenhado className="onde__mapa" />
        </div>
      </Secao>
      <ChamadaFinal />
    </>
  );
}
