"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { kiribanOf } from "@/lib/kiriban";
import { TwitterIcon } from "./icons";

const DIRECT_URL = "https://kauntah-svg.vercel.app/counter.svg";
const HIDDEN_KEY = "kiriban-hidden";

type Counter = { status: "loading" } | { status: "ok"; src: string; count: number } | { status: "direct" };

// One hit per page load: shared across React's dev double-mount and any
// client-side re-navigation back to the home page.
let pending: Promise<Counter> | null = null;

function loadCounter(): Promise<Counter> {
  pending ??= fetch("/api/counter", { cache: "no-store" })
    .then(async (res) => {
      const count = Number(res.headers.get("x-count"));
      if (!res.ok || !Number.isFinite(count) || count <= 0) return { status: "direct" } as const;
      const src = URL.createObjectURL(await res.blob());
      return { status: "ok", src, count } as const;
    })
    .catch(() => ({ status: "direct" }) as const);
  return pending;
}

function readHidden() {
  try {
    return sessionStorage.getItem(HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

export default function Kiriban() {
  const [counter, setCounter] = useState<Counter>({ status: "loading" });
  const [dismissed, setDismissed] = useState(false);
  // Dismissal lasts for this tab's session; read it without a hydration mismatch.
  const hiddenForSession = useSyncExternalStore(noopSubscribe, readHidden, () => false);

  useEffect(() => {
    if (readHidden()) return; // already counted this session
    let alive = true;
    loadCounter().then((c) => alive && setCounter(c));
    return () => {
      alive = false;
    };
  }, []);

  if (dismissed || hiddenForSession) return null;

  const hit = counter.status === "ok" ? kiribanOf(counter.count) : null;

  function dismiss() {
    try {
      sessionStorage.setItem(HIDDEN_KEY, "1");
    } catch {
      // storage blocked: hide for this page view only
    }
    setDismissed(true);
  }

  return (
    <aside className="kiriban" aria-label="アクセスカウンター">
      <button type="button" className="kiriban__close" onClick={dismiss} aria-label="カウンターを閉じる">
        ×
      </button>
      {counter.status === "loading" ? (
        <div className="kiriban__counter kiriban__counter--loading" aria-hidden="true" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- live counter (blob / third-party SVG), not optimizable
        <img
          className="kiriban__counter"
          src={counter.status === "ok" ? counter.src : DIRECT_URL}
          referrerPolicy="origin"
          alt={counter.status === "ok" ? `アクセスカウンター: ${counter.count}` : "アクセスカウンター"}
          height={75}
        />
      )}
      <p className="kiriban__note">キリ番踏み逃げ禁止！！！！</p>
      {hit && (
        <p
          className={`kiriban__hit-text${hit.kind === "special" ? " kiriban__hit-text--special" : ""}`}
          role="status"
        >
          {hit.display} は{hit.label}！
          <br />
          {hit.kind === "special" ? "……この数字、ほかでも見かけたかも？" : "踏み逃げせずに報告してね。"}
        </p>
      )}
      {hit ? (
        <a
          className="btn btn--cta kiriban__post"
          // Only rendered client-side (after the count loads), so `window` is safe here.
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${window.location.origin}/\nキリ番をゲットしました！`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="キリ番をツイートする(新しいタブで開く)"
        >
          <TwitterIcon className="btn__icon" size={12} />
          <span>キリ番をツイートする</span>
          <span className="btn__ext" aria-hidden="true">
            ↗
          </span>
        </a>
      ) : (
        <button
          type="button"
          className="btn btn--cta kiriban__post"
          disabled
          title="キリ番を踏むと押せます"
          aria-describedby="kiriban-post-hint"
        >
          <TwitterIcon className="btn__icon" size={12} />
          <span>キリ番をツイートする</span>
          <span id="kiriban-post-hint" className="sr-only">
            キリ番を踏むと押せます
          </span>
        </button>
      )}
    </aside>
  );
}
