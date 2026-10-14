import type { MetadataRoute } from "next";
import { entradasSitemap } from "@/lib/rotas";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return entradasSitemap(SITE_URL);
}
