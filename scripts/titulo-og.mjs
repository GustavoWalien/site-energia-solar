/** Divide o título da imagem de compartilhamento: a última palavra ganha o marca-texto. Uma palavra só vai inteira. */
export function dividirTitulo(rotulo) {
  const texto = rotulo.trim();
  const corte = texto.lastIndexOf(" ");
  return corte < 0 ? { inicio: "", destaque: texto } : { inicio: texto.slice(0, corte), destaque: texto.slice(corte + 1) };
}
