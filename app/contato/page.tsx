import type { Metadata } from "next";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export const metadata: Metadata = { title: "Contato" };

export default function Contato() {
  return (
    <EmConstrucao titulo="Contato" texto="O mapa, o horário e o formulário de contato chegam no Plano 3." />
  );
}
