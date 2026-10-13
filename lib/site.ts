// Só servidor. Na Vercel, VERCEL_PROJECT_PRODUCTION_URL vira o domínio próprio assim que ele for configurado.
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://ipe-solar.vercel.app";
}

export const SITE_URL = resolveSiteUrl(process.env);
