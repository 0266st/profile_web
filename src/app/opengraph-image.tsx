import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { GEAR } from "@/lib/gear";
import { AVATARS, ROLES } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { SKILLS } from "@/lib/skills";

// Link-preview card (Discord, X, …): the site's terminal look, as if the
// page had been piped through an `analyze` command.
export const alt = "❯ analyze 0266st — 0266st / 0168th のポートフォリオ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dark code-card palette from tokens.css, as hex (Satori has no oklch).
const C = {
  bg: "#0a0d12",
  bar: "#161b22",
  rule: "#3c434d",
  ink: "#e3e8ef",
  muted: "#8c939c",
  user: "#f37fb0",
  host: "#72adfb",
  ok: "#63d18f",
};

const SUMMARY: [string, string][] = [
  ["role", ROLES.join(" · ")],
  ["builds", projects.map((p) => p.name).join(" · ")],
  ["skills", SKILLS.map((s) => s.name).join(" · ")],
  ["music", GEAR.map(([, value]) => value).join(" · ")],
];

const HOST = "profile.ztssst.dev";
const TEXT = ["root@ztssst.dev ~", "❯ analyze 0266st", HOST, ...AVATARS.map((a) => a.handle), ...SUMMARY.flat()].join("");

// Google Fonts serves a TrueType subset holding just `text` when asked
// without a browser User-Agent — exactly what Satori can read.
async function googleFont(family: string, weight: number, text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}&text=${encodeURIComponent(text)}`
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`no TrueType source for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

async function avatarDataUrl(src: string) {
  const file = await readFile(join(process.cwd(), "public", src));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export default async function Image() {
  const [mono, monoBold, jp, avatars] = await Promise.all([
    googleFont("JetBrains Mono", 500, TEXT),
    googleFont("JetBrains Mono", 700, TEXT),
    // Fallback for glyphs JetBrains Mono lacks (kana/kanji, ❯).
    googleFont("Noto Sans JP", 500, TEXT),
    Promise.all(AVATARS.filter((a) => a.src).map(async (a) => ({ handle: a.handle, url: await avatarDataUrl(a.src!) }))),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.bg,
          color: C.ink,
          fontFamily: "JetBrains Mono, Noto Sans JP",
          fontSize: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            height: 56,
            padding: "0 32px",
            background: C.bar,
            borderBottom: `1px solid ${C.rule}`,
            color: C.muted,
            fontSize: 22,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((dot) => (
            <div key={dot} style={{ width: 14, height: 14, borderRadius: 7, background: dot }} />
          ))}
          <div style={{ marginLeft: 12 }}>{HOST}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "36px 64px 0" }}>
          <div style={{ display: "flex" }}>
            <span style={{ color: C.user }}>root</span>
            <span style={{ color: C.muted }}>@</span>
            <span style={{ color: C.host }}>ztssst.dev</span>
            <span style={{ marginLeft: 16 }}>~</span>
          </div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 40, fontWeight: 700 }}>
            <span style={{ color: C.ok, marginRight: 20 }}>❯</span>
            <span>analyze 0266st</span>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 30 }}>
            {avatars.map((a) => (
              <div key={a.handle} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <img
                  src={a.url}
                  width={112}
                  height={112}
                  alt=""
                  style={{ borderRadius: 56, border: `3px solid ${C.rule}` }}
                />
                <span style={{ color: C.muted, fontSize: 26 }}>{a.handle}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 34 }}>
            {SUMMARY.map(([key, value]) => (
              <div key={key} style={{ display: "flex" }}>
                <span style={{ width: 150, color: C.host }}>{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: jp, weight: 500, style: "normal" },
      ],
    }
  );
}
