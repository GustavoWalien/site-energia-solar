import { Hero } from "@/components/hero/Hero";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { Depoimentos } from "@/components/inicio/Depoimentos";
import { OQueFazemos } from "@/components/inicio/OQueFazemos";
import { Perguntas } from "@/components/inicio/Perguntas";
import { Promessas } from "@/components/inicio/Promessas";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";
import { config } from "@/content/config";
import { empresa } from "@/content/empresa";
import { perguntas } from "@/content/perguntas";
import { negocioLocal, perguntasFrequentes } from "@/lib/jsonld";
import { metadados, tituloFinal } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// O modelo "%s | Ipê Solar" do layout só vale para os segmentos filhos; a Início, no mesmo segmento, leva o título inteiro.
export const metadata = metadados(
  { ...empresa.seo, titulo: tituloFinal(empresa.seo, empresa.nome), absoluto: true },
  { caminho: "/" },
);

export default function Inicio() {
  return (
    <>
      <DadosEstruturados dados={[negocioLocal(config, empresa, SITE_URL), perguntasFrequentes(perguntas)]} />
      <Hero />
      <OQueFazemos />
      <SecaoSimulador />
      <ComoFunciona />
      <Promessas />
      <Depoimentos />
      <Perguntas />
      <ChamadaFinal />
    </>
  );
}
