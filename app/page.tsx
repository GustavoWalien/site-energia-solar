import { Hero } from "@/components/hero/Hero";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { OQueFazemos } from "@/components/inicio/OQueFazemos";
import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";

export default function Inicio() {
  return (
    <>
      <Hero />
      <OQueFazemos />
      <SecaoSimulador />
      <ComoFunciona />
    </>
  );
}
