import { siteOrigin } from "@/lib/site-origin";

// Hand-written so it can carry comments/art (app/robots.ts can't) and still
// point at an absolute Sitemap URL for whatever host serves the site.
function robots(origin: string | null) {
  return `#
#   root@ztssst.dev ~
#   ❯ cat /robots.txt
#
#      /\\_/\\      Hello, robot.
#     ( o.o )     You're welcome here — mostly.
#      > ^ <
#
#   クローラーの皆さんも、キリ番踏み逃げ禁止！！！！
#
#   Looking for hidden paths? Nice try — they aren't listed here.
#   (Humans: 0266 / 0168 — ただの名前だと思った？)
#

User-agent: *
# The access counter lives here. Please don't spin it.
# (Listed before Allow so first-match parsers agree with longest-match ones.)
Disallow: /api/
Allow: /
${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""}
# EOF
`;
}

export function GET(request: Request) {
  return new Response(robots(siteOrigin(request)), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
