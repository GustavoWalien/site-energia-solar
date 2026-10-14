import { serializar, type Dados } from "@/lib/jsonld";

/** Os dados estruturados da página (schema.org), um <script> por bloco. Não aparecem na tela. */
export function DadosEstruturados({ dados }: { dados: Dados[] }) {
  return dados.map((d) => (
    <script key={String(d["@type"])} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializar(d) }} />
  ));
}
