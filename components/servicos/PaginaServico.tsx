import { IconeServico } from "@/components/inicio/IconeServico";
import { ChamadaFinal } from "@/components/inicio/ChamadaFinal";
import { LinkWhatsapp } from "@/components/layout/LinkWhatsapp";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { ListaPerguntas } from "@/components/ui/ListaPerguntas";
import { Secao } from "@/components/ui/Secao";
import { paginas } from "@/content/paginas";
import type { Servico } from "@/content/tipos";
import { preencher } from "@/lib/texto";

const t = paginas.servico;

function Marca() {
  return (
    <svg className="servico__marca" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" fill="#F5B800" stroke="#0E3557" strokeWidth="2.5" />
      <path
        d="M9 16.5 L14 21 L23 11"
        fill="none"
        stroke="#0E3557"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Página de um serviço: abertura com o orçamento, o que está incluído, o bloco próprio do serviço, perguntas e formulário. */
export function PaginaServico({ servico }: { servico: Servico }) {
  return (
    <>
      <CabecalhoPagina
        titulo={servico.h1}
        apoio={servico.abertura}
        trilha={[
          { rotulo: t.trilhaInicio, href: "/" },
          { rotulo: t.trilhaServicos, href: "/servicos" },
          { rotulo: servico.nome },
        ]}
      >
        <div className="servico__acoes">
          <LinkWhatsapp
            className="botao botao--ipe"
            mensagem={preencher(t.mensagem, { servico: servico.nome.toLowerCase() })}
          >
            {t.botao}
          </LinkWhatsapp>
        </div>
        <IconeServico nome={servico.icone} className="servico__icone" />
      </CabecalhoPagina>
      <Secao id="incluido" titulo={servico.incluido.titulo}>
        <ul className="servico__lista">
          {servico.incluido.itens.map((item) => (
            <li key={item}>
              <Marca />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Secao>
      <Secao id="extra" titulo={servico.extra.titulo} className="servico__extra">
        <ul className="servico__chips">
          {servico.extra.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Secao>
      <Secao id="perguntas" titulo={t.perguntas} className="perguntas">
        <ListaPerguntas perguntas={servico.perguntas} />
      </Secao>
      <ChamadaFinal />
    </>
  );
}
