import type { MDXComponents } from "mdx/types";
import { ChamadaOrcamento } from "@/components/blog/ChamadaOrcamento";
import { NaPratica } from "@/components/blog/NaPratica";
import { Simulador } from "@/components/inicio/Simulador";

/** Os componentes que os artigos do blog usam sem importar. */
export const componentesMdx: MDXComponents = { NaPratica, ChamadaOrcamento, Simulador };

// Obrigatório no App Router com @next/mdx.
export function useMDXComponents(): MDXComponents {
  return componentesMdx;
}
