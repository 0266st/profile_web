const HOST_RE = /^[a-z0-9.-]+(:\d{1,5})?$/i;

// This site's public origin: SITE_URL if set, otherwise the (validated)
// forwarded/Host header of the request — so it's right behind a tunnel too.
export function siteOrigin(request: Request): string | null {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL).origin;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host || !HOST_RE.test(host)) return null;
  const proto = request.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto === "http" ? "http" : "https"}://${host}`;
}
