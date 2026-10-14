import { SecaoSimulador } from "@/components/inicio/SecaoSimulador";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export default function Inicio() {
  return (
    <>
      <EmConstrucao
        titulo="Energia solar em Cuiabá."
        texto="A página Início chega no Plano 2, com o hero animado, o simulador e o formulário."
      />
      <SecaoSimulador />
    </>
  );
}
