import { Secao } from "@/components/ui/Secao";
import { inicio } from "@/content/inicio";
import { Simulador } from "./Simulador";

/** A seção do simulador na Início: o momento interativo da página. */
export function SecaoSimulador() {
  return (
    <Secao id="simulador" rotulo={inicio.simulador.rotulo} titulo={inicio.simulador.titulo} className="secao--simulador">
      <Simulador />
    </Secao>
  );
}
