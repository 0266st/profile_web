"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { THEME_LABEL, setThemePref, type ThemePref } from "@/lib/theme";

type Command = {
  label: string;
  hint: string;
  href?: string;
  external?: boolean;
  run?: () => void;
};

const themeCommand = (pref: ThemePref): Command => ({
  label: `テーマ: ${THEME_LABEL[pref]}`,
  hint: "Theme",
  run: () => setThemePref(pref),
});

const COMMANDS: Command[] = [
  { label: "Skills", hint: "Section", href: "/#skills" },
  { label: "Products", hint: "Section", href: "/#products" },
  { label: "madgen", hint: "Project → GitHub", href: "https://github.com/0266st/madgen", external: true },
  {
    label: "VOICEVOX TTS Engine for Android",
    hint: "Project → GitHub",
    href: "https://github.com/0266st/VOICEVOX_TTS_Engine_For_Android",
    external: true,
  },
  { label: "Music", hint: "Section", href: "/#music" },
  { label: "Gear", hint: "Section", href: "/#gear" },
  { label: "問い合わせフォーム", hint: "Page", href: "/contact" },
  { label: "GitHub (0266st)", hint: "Open ↗", href: "https://github.com/0266st", external: true },
  { label: "Twitter (@0168th)", hint: "Open ↗", href: "https://twitter.com/0168th", external: true },
  { label: "YouTube (@0266st)", hint: "Open ↗", href: "https://www.youtube.com/@0266st", external: true },
  { label: "BOOTH (ztssst)", hint: "Open ↗", href: "https://ztssst.booth.pm/", external: true },
  themeCommand("light"),
  themeCommand("dark"),
  themeCommand("system"),
];

export default function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const openPalette = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closePalette = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const runCommand = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      closePalette();
      if (command.run) {
        command.run();
        return;
      }
      if (!command.href) return;
      if (command.external) {
        window.open(command.href, "_blank", "noopener,noreferrer");
        return;
      }
      const url = new URL(command.href, window.location.href);
      const target = url.hash ? document.querySelector(url.hash) : null;
      if (url.pathname === window.location.pathname && target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(command.href);
      }
    },
    [closePalette, router]
  );

  // Native <dialog> handles Escape-to-close and the modal focus trap on its
  // own; we just need to reset local state and return focus on any close
  // (Escape, backdrop click, or a command running) and lock body scroll
  // while open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onClose() {
      document.body.style.overflow = "";
      setQuery("");
      setActiveIndex(0);
      // Deferred: the dialog's own focus-restoration step can otherwise run
      // after this handler and steal focus back.
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    }
    function onCancel() {
      // "cancel" (Escape) fires before "close" — nothing extra needed here,
      // but listening keeps intent explicit if we need it later.
    }
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("cancel", onCancel);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("cancel", onCancel);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isCmdK) return;
      e.preventDefault();
      if (dialogRef.current?.open) {
        closePalette();
      } else {
        document.body.style.overflow = "hidden";
        openPalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPalette, closePalette]);

  function handleTriggerClick() {
    document.body.style.overflow = "hidden";
    openPalette();
  }

  function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[activeIndex]);
    }
  }

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    // A click landing on the <dialog> element itself (not a descendant) is a
    // click on the ::backdrop — light-dismiss.
    if (e.target === dialogRef.current) closePalette();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="searchpill"
        aria-label="ジャンプ先を検索(⌘K)"
        onClick={handleTriggerClick}
      >
        <span className="searchpill__text">ジャンプ…</span>
        <span className="searchpill__kbd">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="cmdk__panel"
        aria-label="コマンドパレット"
        onClick={handleDialogClick}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="cmdk__field">
          <input
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="ジャンプ先を検索…"
            aria-label="ジャンプ先を検索"
          />
          <kbd>esc</kbd>
        </div>
        <div className="cmdk__results">
          <p className="cmdk__group">Jump to</p>
          {results.length === 0 && <p className="cmdk__item muted">見つかりませんでした</p>}
          {results.map((command, i) => (
            <button
              key={command.label}
              type="button"
              className={`cmdk__item${i === activeIndex ? " is-active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => runCommand(command)}
            >
              <span>{command.label}</span>
              <span className="cmdk__item-hint">{command.hint}</span>
            </button>
          ))}
        </div>
        <div className="cmdk__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </dialog>
    </>
  );
}
