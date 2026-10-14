import type { MetadataRoute } from "next";
import { regrasRobots } from "@/lib/rotas";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return regrasRobots(SITE_URL);
}
