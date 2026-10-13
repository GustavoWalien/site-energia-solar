import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { empresa } from "@/content/empresa";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--fonte-display", display: "swap" });
const texto = Figtree({ subsets: ["latin"], variable: "--fonte-texto", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "500", variable: "--fonte-mono", display: "swap" });

// O site inteiro sai pronto no build: nenhuma página renderiza por visita.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${empresa.seo.titulo} | ${empresa.nome}`, template: `%s | ${empresa.nome}` },
  description: empresa.seo.descricao,
  openGraph: { type: "website", locale: "pt_BR", siteName: empresa.nome },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0E3557" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${texto.variable} ${mono.variable}`}>
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
