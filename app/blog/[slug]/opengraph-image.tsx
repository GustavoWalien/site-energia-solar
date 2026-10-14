import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { paginas } from "@/content/paginas";
import { acharArtigo, artigosOrdenados } from "@/lib/blog";

export const alt = "Artigo do blog da Ipê Solar, energia solar em Cuiabá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return artigosOrdenados.map((a) => ({ slug: a.slug }));
}

// Fontes guardadas no projeto (licença OFL): o ImageResponse lê WOFF, mas não WOFF2.
const pasta = join(process.cwd(), "assets/fontes");
const bricolage = await readFile(join(pasta, "bricolage-grotesque-latin-800-normal.woff"));
const figtree = await readFile(join(pasta, "figtree-latin-600-normal.woff"));

/** A imagem que aparece quando o link do artigo é compartilhado: a placa, o título e o sol, nas cores da marca. */
export default async function Imagem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = acharArtigo(slug);
  const titulo = artigo?.metadata.titulo ?? paginas.blog.titulo;
  const rodape = artigo ? `${paginas.blog.titulo} · ${artigo.metadata.leitura} ${paginas.blog.minutos}` : paginas.blog.titulo;
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0 80px 60px",
          background: "#D6EEFB",
          borderTop: "14px solid #0E3557",
          color: "#0E3557",
          fontFamily: "Figtree",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "26px 30px 22px",
            background: "#F5B800",
            border: "5px solid #0E3557",
            borderTop: "0",
            borderRadius: "0 0 28px 28px",
            fontFamily: "Bricolage",
            fontSize: 40,
          }}
        >
          Ipê Solar
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 820,
            fontFamily: "Bricolage",
            fontSize: 66,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {titulo}
        </div>
        <div style={{ display: "flex", fontSize: 30 }}>{rodape}</div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 70,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "#FFD23F",
            border: "6px solid #0E3557",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 800, style: "normal" },
        { name: "Figtree", data: figtree, weight: 600, style: "normal" },
      ],
    },
  );
}
