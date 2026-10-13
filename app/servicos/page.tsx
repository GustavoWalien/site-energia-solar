import type { Metadata } from "next";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export const metadata: Metadata = { title: "Serviços" };

export default function Servicos() {
  return (
    <EmConstrucao
      titulo="Serviços"
      texto="As páginas de serviço chegam no Plano 3: casa, empresas, campo e limpeza de placas."
    />
  );
}
