import { siteOrigin } from "@/lib/site-origin";

const PATHS = ["/", "/contact"];

export function GET(request: Request) {
  const origin = siteOrigin(request);
  if (!origin) return new Response(null, { status: 400 });
  const urls = PATHS.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
