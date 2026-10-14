import { Hero } from "@/components/hero/Hero";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { Depoimentos } from "@/components/inicio/Depoimentos";
import { OQueFazemos } from "@/components/inicio/OQueFazemos";
import { Perguntas } from "@/components/inicio/Perguntas";
import { Promessas } from "@/components/inicio/Promessas";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";
import { empresa } from "@/content/empresa";
import { metadados, tituloFinal } from "@/lib/seo";

// O modelo "%s | Ipê Solar" do layout só vale para os segmentos filhos; a Início, no mesmo segmento, leva o título inteiro.
export const metadata = metadados(
  { ...empresa.seo, titulo: tituloFinal(empresa.seo, empresa.nome), absoluto: true },
  { caminho: "/" },
);

export default function Inicio() {
  return (
    <>
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
