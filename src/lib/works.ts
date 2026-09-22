export type Work = {
  title: string;
  /** A YouTube or Spotify URL, pasted as-is. */
  url: string;
  /** Release date, e.g. "2026-09". Optional. */
  date?: string;
};

export type MediaSource =
  | { kind: "youtube"; id: string }
  | { kind: "spotify"; type: "track" | "album" | "playlist" | "episode"; id: string };

// Newest first. Add a work by pasting its URL.
export const works: Work[] = [];

const YOUTUBE_ID = /^[\w-]{11}$/;
const SPOTIFY_ID = /^[A-Za-z0-9]{22}$/;

// Only IDs that pass these checks ever reach an iframe/src URL.
export function parseMediaUrl(raw: string): MediaSource | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtube.com") {
    const id = parts[0] === "watch" ? url.searchParams.get("v") : ["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null;
    return id && YOUTUBE_ID.test(id) ? { kind: "youtube", id } : null;
  }
  if (host === "youtu.be") {
    const id = parts[0];
    return id && YOUTUBE_ID.test(id) ? { kind: "youtube", id } : null;
  }
  if (host === "open.spotify.com") {
    const rest = parts[0]?.startsWith("intl-") ? parts.slice(1) : parts;
    const [type, id] = rest;
    if ((type === "track" || type === "album" || type === "playlist" || type === "episode") && id && SPOTIFY_ID.test(id)) {
      return { kind: "spotify", type, id };
    }
  }
  return null;
}
