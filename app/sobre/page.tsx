import type { Metadata } from "next";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export const metadata: Metadata = { title: "Sobre" };

export default function Sobre() {
  return (
    <EmConstrucao titulo="Sobre" texto="A história da Ipê Solar e a equipe ilustrada chegam no Plano 3." />
  );
}
