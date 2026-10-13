import type { Metadata } from "next";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return <EmConstrucao titulo="Blog" texto="Os três artigos chegam no Plano 4: Fio B, seca e créditos de energia." />;
}
