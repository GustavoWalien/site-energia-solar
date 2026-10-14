/**
 * Link do wa.me a partir de um número do Brasil em qualquer formato, com o DDI 55 e o DDD.
 * Número inválido ou sem o 55 devolve null: o wa.me leria "65 9..." como outro país (+65).
 */
export function whatsappUrl(number: string, text?: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(digits)) return null;
  const url = `https://wa.me/${digits}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
