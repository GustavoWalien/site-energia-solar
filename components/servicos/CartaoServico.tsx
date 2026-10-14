import Link from "next/link";
import { IconeServico } from "@/components/inicio/IconeServico";
import type { Servico } from "@/content/tipos";

type Props = { servico: Servico; nivel: "h2" | "h3" };

/**
 * Cartão de um serviço (estilo em fazemos.css). O nível do título depende de onde o cartão está.
 * prefetch={true}: a página do serviço lê o endereço (params), e assim o conteúdo já vem antes do clique.
 */
export function CartaoServico({ servico, nivel: Titulo }: Props) {
  return (
    <li className="fazemos__cartao">
      <IconeServico nome={servico.icone} className="fazemos__icone" />
      <Titulo className="fazemos__titulo">{servico.cartao.titulo}</Titulo>
      <p className="fazemos__texto">{servico.cartao.texto}</p>
      <Link className="fazemos__link" href={`/servicos/${servico.slug}`} prefetch={true}>
        {servico.nome} <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}
