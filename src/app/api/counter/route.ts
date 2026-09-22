// Proxies the Kauntah counter so the page can read the number (for キリ番)
// without a CORS-less cross-origin image. Kauntah counts per Referer origin,
// so we forward this site's origin; every call is one hit.
import { siteOrigin } from "@/lib/site-origin";

const KAUNTAH_URL = "https://kauntah-svg.vercel.app/counter.svg";

export async function GET(request: Request) {
  const origin = siteOrigin(request);
  if (!origin) return new Response(null, { status: 400 });

  try {
    const res = await fetch(KAUNTAH_URL, {
      headers: { Referer: `${origin}/` },
      cache: "no-store",
      // Kauntah runs on Vercel; a cold start can take several seconds.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return new Response(null, { status: 502 });
    const svg = await res.text();
    // Each digit is drawn by <use href="#image-N">, left to right.
    const count = [...svg.matchAll(/<use[^>]*href="#image-(\d)"/g)].map((m) => m[1]).join("");
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Count": count,
      },
    });
  } catch (error) {
    // Undici hides the real reason (DNS, reset, timeout…) in `cause`.
    console.warn("[counter] kauntah fetch failed:", error, error instanceof Error ? error.cause : undefined);
    return new Response(null, { status: 504 });
  }
}
