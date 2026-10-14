import { Hero } from "@/components/hero/Hero";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { Depoimentos } from "@/components/inicio/Depoimentos";
import { OQueFazemos } from "@/components/inicio/OQueFazemos";
import { Perguntas } from "@/components/inicio/Perguntas";
import { Promessas } from "@/components/inicio/Promessas";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";

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
