import { serializar, type Dados } from "@/lib/jsonld";

/** Os dados estruturados da página (schema.org), um <script> por bloco. Não aparecem na tela. */
export function DadosEstruturados({ dados }: { dados: Dados[] }) {
  return dados.map((d, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializar(d) }} />
  ));
}
